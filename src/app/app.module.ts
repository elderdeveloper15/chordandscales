// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AudioService } from './services/audio.service';
import { MidiService } from './services/midi.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importa el servicio MIDI
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PianoComponent } from './piano/piano.component';


@NgModule({
  declarations: [
    AppComponent,
    PianoComponent,
    // Otros componentes
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  providers: [
    AudioService,
    MidiService,
    provideAnimationsAsync(), // Agrega el servicio MIDI
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
