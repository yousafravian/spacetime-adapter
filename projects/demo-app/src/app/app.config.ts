import { ApplicationConfig, provideZoneChangeDetection, signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { provideSpacetimeAdapter, SPACETIME_DATE_FORMATS, SPACETIME_TIMEZONE } from 'spacetime-adapter'; // Use path mapping

import { routes } from './app.routes';

// Create a signal for the timezone that can be updated
export const appTimezoneSignal: WritableSignal<string> = signal('UTC');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),

    // --- Spacetime Adapter Setup ---
    // 1. Provide the adapter, passing our app-level signal
    provideSpacetimeAdapter(appTimezoneSignal),

    // 2. Provide the recommended date formats
    { provide: MAT_DATE_FORMATS, useValue: SPACETIME_DATE_FORMATS },

    // Note: We don't need to provide SPACETIME_TIMEZONE directly here,
    // because provideSpacetimeAdapter handles it internally using the signal we passed.
  ]
};
