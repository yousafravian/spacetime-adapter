import { EnvironmentProviders, makeEnvironmentProviders, Signal, signal } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import { SpacetimeAdapter } from './spacetime.adapter';
import { SPACETIME_TIMEZONE } from './spacetime.token';
import { SPACETIME_DATE_FORMATS } from './spacetime-formats';

/**
 * Provides the SpacetimeAdapter and configures the default timezone signal.
 *
 * @param timeZoneInput Optional timezone string or a Signal<string>. If omitted, defaults to a signal containing 'UTC'.
 *                      If a string is provided, it will be wrapped in a signal.
 * @returns EnvironmentProviders for the SpacetimeAdapter setup.
 */
export function provideSpacetimeAdapter(
  timeZoneInput?: string | Signal<string>
): EnvironmentProviders {
  // Determine the signal to provide based on the input
  const timezoneSignal = typeof timeZoneInput === 'function' // Check if it's likely a Signal
    ? timeZoneInput
    : signal(timeZoneInput ?? 'UTC'); // Wrap string or default in a signal

  return makeEnvironmentProviders([
    {
      provide: DateAdapter,
      useClass: SpacetimeAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: SPACETIME_DATE_FORMATS,
    },
    {
      provide: SPACETIME_TIMEZONE,
      useValue: timezoneSignal, // Provide the resolved signal
    },
  ]);
} 