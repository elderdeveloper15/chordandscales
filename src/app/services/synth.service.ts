// src/app/services/synth.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SynthService {
  private audioContext: AudioContext | null = null;
  private oscillatorMap: Map<number, OscillatorNode> = new Map();

  constructor() {
    // No creamos el AudioContext aquí
  }

  private ensureAudioContext() {
    if (!this.audioContext) {
      // Creamos el AudioContext cuando se necesite, en respuesta a una interacción del usuario
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } else if (this.audioContext.state === 'suspended') {
      // Reanudamos el AudioContext si está suspendido
      this.audioContext.resume();
    }
  }

  playNote(noteNumber: number) {
    this.ensureAudioContext();

    const frequency = this.midiNoteToFrequency(noteNumber);
    const oscillator = this.audioContext!.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine'; // Puedes cambiar el tipo de onda si lo deseas
    oscillator.connect(this.audioContext!.destination);
    oscillator.start();

    // Guardamos el oscilador para poder detenerlo después
    this.oscillatorMap.set(noteNumber, oscillator);
  }

  stopNote(noteNumber: number) {
    const oscillator = this.oscillatorMap.get(noteNumber);
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
      this.oscillatorMap.delete(noteNumber);
    }
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  private midiNoteToFrequency(noteNumber: number): number {
    // Convierte el número de nota MIDI a frecuencia en Hz
    return 440 * Math.pow(2, (noteNumber - 69) / 12);
  }
}
