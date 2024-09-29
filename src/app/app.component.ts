// src/app/app.component.ts

import { Component } from '@angular/core';
import { AudioService } from './services/audio.service';
import { freqToMidi } from '@tonaljs/midi';
import  Note  from '@tonaljs/note';
import { Scale, Chord } from '@tonaljs/tonal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentNote!: string;
  currentFrequency!: number;
  playedNotes: string[] = [];
  currentScale!: string;
  suggestedChords: string[] = [];
  audioStarted = false;

  // Nueva propiedad para almacenar el género seleccionado
  selectedGenre!: string;

  // Lista de géneros disponibles
  genres: string[] = ['Rock', 'Jazz', 'Blues', 'Pop', 'Clásica'];

  constructor(private audioService: AudioService) {}

  async startAudio() {
    if (!this.selectedGenre) {
      alert('Por favor, selecciona un género musical antes de continuar.');
      return;
    }

    try {
      await this.audioService.initAudio();
      if (this.audioService.getAudioContext().state === 'suspended') {
        await this.audioService.getAudioContext().resume();
      }
      this.audioStarted = true;
      this.updatePitch();
    } catch (err) {
      console.error('No se pudo inicializar el audio:', err);
      alert('Error al acceder al micrófono. Por favor, verifica los permisos.');
    }
  }

  updatePitch() {
    setInterval(() => {
      const { pitch, clarity } = this.audioService.getPitch();
      if (pitch && clarity > 0.9) {
        this.currentFrequency = pitch;
        const midi = freqToMidi(pitch);
        this.currentNote = Note.fromMidi(midi);
        if (this.currentNote && !this.playedNotes.includes(this.currentNote)) {
          this.playedNotes.push(this.currentNote);
          this.analyzeScale();
        }
      }
    }, 100);
  }

  analyzeScale() {
    // Aquí modificamos la lógica para tener en cuenta el género seleccionado
    const possibleScales = this.getScalesForGenre(this.selectedGenre).filter((scaleName) => {
      const scale = Scale.get(`${this.currentNote} ${scaleName}`);
      return this.playedNotes.every((note) => scale.notes.includes(note));
    });

    if (possibleScales.length > 0) {
      this.currentScale = `${this.currentNote} ${possibleScales[0]}`;
      this.suggestChords();
    }
  }

  suggestChords() {
    const scale = Scale.get(this.currentScale);
    this.suggestedChords = scale.notes.map((note) => {
      const chordType = this.getChordTypeForGenre(this.selectedGenre);
      const chord = Chord.getChord(chordType, note);
      return chord.name;
    });
  }

  reset() {
    this.playedNotes = [];
    this.currentScale = '';
    this.suggestedChords = [];
    this.audioStarted = false;
    this.selectedGenre = "";
  }

  // Nuevos métodos para obtener escalas y acordes según el género
  getScalesForGenre(genre: string): string[] {
    switch (genre) {
      case 'Rock':
        return ['minor pentatonic', 'major', 'minor'];
      case 'Jazz':
        return ['dorian', 'mixolydian', 'lydian', 'minor'];
      case 'Blues':
        return ['blues', 'minor pentatonic'];
      case 'Pop':
        return ['major', 'minor'];
      case 'Clásica':
        return ['major', 'minor', 'harmonic minor', 'melodic minor'];
      default:
        return Scale.names(); // Todas las escalas si el género no es reconocido
    }
  }

  getChordTypeForGenre(genre: string): string {
    switch (genre) {
      case 'Rock':
        return '5'; // Acordes de quinta (power chords)
      case 'Jazz':
        return 'maj7'; // Acordes mayores séptima
      case 'Blues':
        return '7'; // Acordes séptima dominante
      case 'Pop':
        return 'maj'; // Acordes mayores
      case 'Clásica':
        return 'maj'; // Acordes mayores
      default:
        return 'maj'; // Acordes mayores por defecto
    }
  }
}
