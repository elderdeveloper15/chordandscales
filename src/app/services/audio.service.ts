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

  // Nuevas propiedades
  private gainNode!: GainNode;
  public isMuted: boolean = true; // El audio está muteado por defecto

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

      // Crear un GainNode para controlar el volumen (mute/unmute)
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0; // Iniciamos en mute

      // Conectar la fuente del micrófono al GainNode
      this.input.connect(this.gainNode);

      // Conectar el GainNode a la salida de audio (speakers)
      this.gainNode.connect(this.audioContext.destination);

      // También conectamos la entrada al analyser para la detección de pitch
      this.input.connect(this.analyser);

      const bufferLength = 2048;
      this.buffer = new Float32Array(bufferLength);
      this.detector = PitchDetector.forFloat32Array(bufferLength);
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      throw err;
    }
  }

  // Método para mutear/desmutear el audio
  toggleMute() {
    if (this.gainNode) {
      this.isMuted = !this.isMuted;
      this.gainNode.gain.value = this.isMuted ? 0 : 1;
    }
  }

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
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
