import { InjectionToken, Signal } from '@angular/core';

/**
 * Injection token for providing the default timezone Signal for Spacetime operations.
 * The value provided should be a Signal<string>.
 */
export const SPACETIME_TIMEZONE = new InjectionToken<Signal<string>>('SPACETIME_TIMEZONE_SIGNAL'); 