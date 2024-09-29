// src/app/services/audio.service.ts

import { Injectable } from '@angular/core';
import { PitchDetector } from 'pitchy';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext!: AudioContext;
  private stream!: MediaStream;
  private analyser!: AnalyserNode;
  private input!: MediaStreamAudioSourceNode;
  private buffer!: Float32Array;
  private detector!: any;

  constructor() {
    // No inicializamos el audioContext aquí
  }

  async initAudio() {
    try {
      // Creamos el AudioContext dentro de initAudio()
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.analyser = this.audioContext.createAnalyser();
      this.input = this.audioContext.createMediaStreamSource(this.stream);
      this.input.connect(this.analyser);

      const bufferLength = 2048;
      this.buffer = new Float32Array(bufferLength);
      this.detector = PitchDetector.forFloat32Array(bufferLength);
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      throw err;
    }
  }

  // Agrega este método para obtener el audioContext
  getAudioContext(): AudioContext {
    return this.audioContext;
  }

  getPitch() {
    if (!this.analyser || !this.buffer) {
      console.warn('getPitch() llamado antes de inicializar analyser o buffer');
      return { pitch: null, clarity: 0 };
    }
    this.analyser.getFloatTimeDomainData(this.buffer);
    const [pitch, clarity] = this.detector.findPitch(this.buffer, this.audioContext.sampleRate);
    return { pitch, clarity };
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }
}
