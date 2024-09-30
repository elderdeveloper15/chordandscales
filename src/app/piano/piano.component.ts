// src/app/piano/piano.component.ts

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-piano',
  templateUrl: './piano.component.html',
  styleUrls: ['./piano.component.css']
})
export class PianoComponent {
  @Input() activeNote: string | null = null;

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
  
}
