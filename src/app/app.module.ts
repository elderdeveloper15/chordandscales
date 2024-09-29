// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importamos FormsModule

import { AppComponent } from './app.component';
import { AudioService } from './services/audio.service';

@NgModule({
  declarations: [
    AppComponent,
    // Otros componentes
  ],
  imports: [
    BrowserModule,
    FormsModule, // Agregamos FormsModule a los imports
  ],
  providers: [
    AudioService,
    // Otros servicios
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
