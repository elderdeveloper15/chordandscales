// src/app/app.component.ts

import { Component,NgZone  } from '@angular/core';
import { AudioService } from './services/audio.service';
import { MidiService } from './services/midi.service'; // Importa el servicio MIDI
import { SynthService } from './services/synth.service'; // Importa SynthService
import { freqToMidi } from '@tonaljs/midi';
import  Note  from '@tonaljs/note';
import { Scale, Chord } from '@tonaljs/tonal';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in')]),
    ]),
  ]
})
export class AppComponent {
  currentNote!: string;
  currentFrequency!: number;
  playedNotes: string[] = [];
  currentScale!: string;
  suggestedChords: string[] = [];
  audioStarted = false;
  scaleNotes: string[] = [];

  // Nueva propiedad para almacenar el género seleccionado
  selectedGenre!: string;

  // Lista de géneros disponibles
  genres: string[] = ['Rock', 'Jazz', 'Blues', 'Pop', 'Clásica'];

  selectedInputType!: string; // 'microphone' o 'midi'


  constructor(
    public audioService: AudioService,
    private midiService: MidiService, // Inyectamos el servicio MIDI
    private synthService: SynthService, // Inyecta SynthService
    private ngZone: NgZone // Inyectamos NgZone
  ) {}

  async start() {
    if (!this.selectedGenre || !this.selectedInputType) {
      alert('Por favor, selecciona el género musical y el tipo de entrada antes de continuar.');
      return;
    }
  
    try {
      if (this.selectedInputType === 'microphone') {
        await this.audioService.initAudio();
        const audioContext = this.audioService.getAudioContext();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        this.audioStarted = true;
        this.updatePitchFromMicrophone();
      } else if (this.selectedInputType === 'midi') {
        await this.midiService.initMidi();
        this.audioStarted = true;
        this.updatePitchFromMidi();
      }
    } catch (err) {
      console.error('No se pudo inicializar la entrada:', err);
      alert('Error al acceder a la entrada seleccionada. Por favor, verifica los permisos.');
    }
  }

  updatePitchFromMicrophone() {
    setInterval(() => {
      const { pitch, clarity } = this.audioService.getPitch();
      if (pitch && clarity > 0.9) {
        this.currentFrequency = pitch;
        const midi = freqToMidi(pitch);
        this.currentNote = Note.pitchClass(Note.fromMidi(midi));
        this.processNote();
      }
    }, 100);
  }

  toggleMute() {
    this.audioService.toggleMute();
  }
  
  updatePitchFromMidi() {
    this.midiService.onNoteReceived((note: string, velocity: number) => {
      // Ejecutamos dentro de NgZone para que Angular detecte los cambios
      this.ngZone.run(() => {
        console.log(`Callback de nota recibido: ${note}, Velocidad: ${velocity}`);
        this.currentNote = Note.pitchClass(note);
        console.log('Nota actual:', this.currentNote);
        const frequency = Note.freq(note);
        if (frequency !== null) {
          this.currentFrequency = frequency;
        } else {
          console.warn(`No se pudo obtener la frecuencia para la nota ${note}`);
          this.currentFrequency = 0;
        }
        this.processNote();
      });
    });
  }

  processNote() {
    if (this.currentNote) {
      const pitchClass = Note.pitchClass(this.currentNote);
      if (pitchClass && !this.playedNotes.includes(pitchClass)) {
        this.playedNotes.push(pitchClass);
        console.log('Notas tocadas:', this.playedNotes);
  
        // Verificamos si hay al menos 3 notas únicas
        if (this.playedNotes.length >= 3) {
          this.analyzeScale();
        }
      }
    }
  }  

  analyzeScale() {
    // Obtenemos las escalas posibles según el género seleccionado
    const possibleScales = this.getScalesForGenre(this.selectedGenre).filter((scaleName) => {
      const scale = Scale.get(`${this.currentNote} ${scaleName}`);
  
      // Convertimos las notas de la escala a su clase de tono
      const scaleNotes = scale.notes.map((note) => Note.pitchClass(note));
  
      // Verificamos si todas las notas tocadas están en la escala
      const includesAllNotes = this.playedNotes.every((note) => scaleNotes.includes(note));
  
      return includesAllNotes;
    });
  
    console.log('Possible Scales:', possibleScales);
  
    if (possibleScales.length > 0) {
      this.currentScale = `${this.currentNote} ${possibleScales[0]}`;
  
      // Obtenemos las notas de la escala detectada
      const scale = Scale.get(this.currentScale);
      this.scaleNotes = scale.notes;
  
      this.suggestChords();
    } else {
      console.warn('No se encontraron escalas que incluyan las notas tocadas.');
      this.currentScale = '';
      this.scaleNotes = [];
      this.suggestedChords = [];
    }
  }  
  
  suggestChords() {
    if (!this.currentScale) {
      return;
    }
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
    this.scaleNotes = [];
    this.suggestedChords = [];
    this.currentNote = '';
    this.currentFrequency = 0;
    this.audioStarted = false;
    this.selectedGenre = '';
    this.selectedInputType = '';
    // Detener los servicios si es necesario
    this.audioService.stop();
    this.midiService.stop();
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
