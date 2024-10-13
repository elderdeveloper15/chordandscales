// src/app/piano/piano.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.css']
})
export class PianoComponent {
  @Input() activeNote: string | null = null;
  @Input() scaleNotes: string[] = []; // Para resaltar notas de la escala

  keys = [
    { note: 'C', isSharp: false },
    { note: 'Db', isSharp: true },
    { note: 'D', isSharp: false },
    { note: 'Eb', isSharp: true },
    { note: 'E', isSharp: false },
    { note: 'F', isSharp: false },
    { note: 'Gb', isSharp: true },
    { note: 'G', isSharp: false },
    { note: 'Ab', isSharp: true },
    { note: 'A', isSharp: false },
    { note: 'Bb', isSharp: true },
    { note: 'B', isSharp: false },
  ];

  isActive(note: string): boolean {
    return this.activeNote === note;
  }

  isInScale(note: string): boolean {
    return this.scaleNotes.includes(note);
  }

  getKeyPosition(index: number): number {
    const key = this.keys[index];
    const whiteKeyWidth = 50;
    const blackKeyWidth = 30;
  
    if (!key.isSharp) {
      // Posición de teclas blancas
      return (this.getNumberOfWhiteKeysBefore(index)) * whiteKeyWidth;
    } else {
      // Posición de teclas negras (ajustar para que estén centradas entre las teclas blancas)
      return (
        this.getNumberOfWhiteKeysBefore(index) * whiteKeyWidth -
        blackKeyWidth / 2
      );
    }
  }
  
  getNumberOfWhiteKeysBefore(index: number): number {
    return this.keys.slice(0, index).filter((key) => !key.isSharp).length;
  }
  
}
