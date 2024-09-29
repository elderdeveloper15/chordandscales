// src/app/app.component.ts

import { Component } from '@angular/core';
import { AudioService } from './services/audio.service';
import { freqToMidi } from '@tonaljs/midi';
import  Note  from '@tonaljs/note';
import  Midi  from '@tonaljs/midi'; // Opcional si necesitas funciones adicionales de Midi
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
  audioStarted = false; // Nueva propiedad para rastrear el estado del audio

  constructor(private audioService: AudioService) {}

  async startAudio() {
    try {
      await this.audioService.initAudio();
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
    const possibleScales = Scale.names().filter((scaleName) => {
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
      const chord = Chord.getChord('maj', note);
      return chord.name;
    });
  }

  reset() {
    this.playedNotes = [];
    this.currentScale = '';
    this.suggestedChords = [];
  }
}
