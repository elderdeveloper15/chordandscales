// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AudioService } from './services/audio.service';
import { MidiService } from './services/midi.service'; // Importa el servicio MIDI

@NgModule({
  declarations: [
    AppComponent,
    // Otros componentes
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [
    AudioService,
    MidiService, // Agrega el servicio MIDI
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
