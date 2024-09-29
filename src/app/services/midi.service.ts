// src/app/services/midi.service.ts
/// <reference types="webmidi" />

import { Injectable } from '@angular/core';
import  Note  from '@tonaljs/note'; // Agrega esta línea

@Injectable({
  providedIn: 'root',
})
export class MidiService {
  private midiAccess!: WebMidi.MIDIAccess;
  private input!: WebMidi.MIDIInput;
  private onNoteCallback!: (note: string, velocity: number) => void;

  constructor() {}

  async initMidi() {
    try {
      if (!navigator.requestMIDIAccess) {
        throw new Error('La API Web MIDI no es compatible con este navegador.');
      }

      this.midiAccess = await navigator.requestMIDIAccess();

      if (this.midiAccess.inputs.size === 0) {
        throw new Error('No se encontraron dispositivos MIDI.');
      }

      // Toma el primer dispositivo MIDI disponible
      this.input = Array.from(this.midiAccess.inputs.values())[0];
      this.input.onmidimessage = this.handleMIDIMessage.bind(this);
    } catch (err) {
      console.error('Error al acceder al dispositivo MIDI:', err);
      throw err;
    }
  }

  onNoteReceived(callback: (note: string, velocity: number) => void) {
    this.onNoteCallback = callback;
  }

  private handleMIDIMessage(message: WebMidi.MIDIMessageEvent) {
    const [command, noteNumber, velocity] = message.data;

    // Filtrar solo mensajes de Note On (144) y Note Off (128)
    const cmd = command & 0xf0;
    if (cmd === 144 && velocity > 0) {
      // Note On
      const note = this.noteNumberToNoteName(noteNumber);
      if (this.onNoteCallback) {
        this.onNoteCallback(note, velocity);
      }
    }
  }

  private noteNumberToNoteName(noteNumber: number): string {
    return Note.fromMidi(noteNumber);
  }

  stop() {
    if (this.input) {
      this.input.onmidimessage = null;
    }
  }
}
