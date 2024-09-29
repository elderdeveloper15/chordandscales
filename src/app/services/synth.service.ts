// src/app/services/synth.service.ts

import { Injectable } from '@angular/core';
import * as Soundfont from 'soundfont-player';
import type { InstrumentName, Player } from 'soundfont-player';
import  Note  from '@tonaljs/note';



@Injectable({
  providedIn: 'root',
})
export class SynthService {
  private audioContext: AudioContext | null = null;
  private piano: Player | null = null;
  private nodeMap: Map<number, Soundfont.Player> = new Map();

  constructor() {
    // No creamos el AudioContext aquí
  }

  async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (!this.piano) {
      try {
        const instrumentName: InstrumentName = 'acoustic_grand_piano';
        this.piano = await Soundfont.instrument(this.audioContext, instrumentName);
      } catch (error) {
        console.error('Error al cargar el instrumento de piano:', error);
      }
    }
  }

  async playNote(noteNumber: number) {
    await this.init();
  
    if (this.audioContext!.state === 'suspended') {
      await this.audioContext!.resume();
    }
  
    const note = this.midiNoteToNoteName(noteNumber);
    if (this.piano) {
      const player = this.piano.play(note);
      this.nodeMap.set(noteNumber, player); // Correcto
    }
  }
  

  stopNote(noteNumber: number) {
    const player = this.nodeMap.get(noteNumber);
    if (player) {
      player.stop();
      this.nodeMap.delete(noteNumber);
    }
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  private midiNoteToNoteName(noteNumber: number): string {
    return Note.fromMidi(noteNumber);
  }
}
