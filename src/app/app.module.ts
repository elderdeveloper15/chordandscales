// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Importa tu componente principal
import { AppComponent } from './app.component';

// Importa el servicio de audio que has creado
import { AudioService } from './services/audio.service';

// Si tienes otros componentes, servicios o módulos, impórtalos aquí
// import { OtroComponente } from './otro-componente/otro-componente.component';

@NgModule({
  declarations: [
    AppComponent,
    // Otros componentes que hayas creado
    // OtroComponente,
  ],
  imports: [
    BrowserModule,
    // Otros módulos que necesites
    // Por ejemplo, si utilizas formularios:
    // FormsModule,
  ],
  providers: [
    AudioService,
    // Otros servicios que hayas creado
    // OtroServicio,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
