import './polyfills';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config'; // Import appConfig

if (environment.production) {
  enableProdMode();
}

// Pass appConfig as the second argument
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));