# Spacetime Adapter for Angular Material

[![npm version](https://badge.fury.io/js/%40devlaps%2Fspacetime-adapter.svg)](https://badge.fury.io/js/%40devlaps%2Fspacetime-adapter)

This library provides a `DateAdapter` implementation for Angular Material that uses the [Spacetime](https://github.com/spencermountain/spacetime) library. This allows you to use Spacetime objects seamlessly with Angular Material components like the Datepicker, while also leveraging Spacetime's powerful timezone handling capabilities.

## Features

*   Integrates `spacetime` with Angular Material's `DateAdapter`.
*   Provides correct date and time handling respecting timezones.
*   Uses Spacetime's parsing and formatting.
*   Configurable default timezone via a `Signal<string>` Injection Token.
*   Reacts dynamically to timezone changes if the provided signal is updated.
*   Standalone API using provider functions.

## Dependencies

This library relies on the following peer dependencies:

*   `@angular/core` (^18.0.0 || ^19.0.0)
*   `@angular/common` (^18.0.0 || ^19.0.0)
*   `@angular/material` (^18.0.0 || ^19.0.0)
*   `@angular/cdk` (^18.0.0 || ^19.0.0)
*   `spacetime` (^7.9.0)

You need to have these installed in your project.

```bash
# Using npm
npm install @angular/core @angular/common @angular/material @angular/cdk spacetime

# Using pnpm
pnpm add @angular/core @angular/common @angular/material @angular/cdk spacetime
```

## Installation

```bash
# Using npm
npm install @devlaps/spacetime-adapter

# Using pnpm
pnpm add @devlaps/spacetime-adapter
```

## Usage

This library is designed for standalone Angular applications.

1.  **Provide the Adapter and Timezone Signal:**

    In your application's bootstrap function (e.g., `main.ts` or `app.config.ts`), use the `provideSpacetimeAdapter` function. You can provide a static timezone string (which will be wrapped in a signal internally) or provide your own `Signal<string>` for dynamic updates.

    ```typescript
    // src/app/app.config.ts
    import { ApplicationConfig, signal, WritableSignal } from '@angular/core';
    import { provideRouter } from '@angular/router';
    import { provideAnimations } from '@angular/platform-browser/animations';
    import { provideSpacetimeAdapter } from '@devlaps/spacetime-adapter'; // Use the package name
    import { routes } from './app.routes';

    // Example: Create your own writable signal for dynamic updates
    export const appTimezoneSignal: WritableSignal<string> = signal('America/New_York');

    export const appConfig: ApplicationConfig = {
      providers: [
        provideRouter(routes),
        provideAnimations(),

        // Provide the Spacetime adapter
        // Option 1: Pass your dynamic signal
        provideSpacetimeAdapter(appTimezoneSignal)

        // Option 2: Pass a static string (adapter creates an internal signal)
        // provideSpacetimeAdapter('UTC')

        // Option 3: Omit parameter to default to an internal signal with 'UTC'
        // provideSpacetimeAdapter()
      ]
    };
    ```

2.  **Provide Date Formats (Optional but Recommended):**

    You should also provide the `MAT_DATE_FORMATS` token using the exported `SPACETIME_DATE_FORMATS` object.

    ```typescript
    // src/app/app.config.ts
    import { ApplicationConfig, signal, WritableSignal } from '@angular/core';
    import { provideRouter } from '@angular/router';
    import { provideAnimations } from '@angular/platform-browser/animations';
    import { MAT_DATE_FORMATS } from '@angular/material/core';
    import {
      provideSpacetimeAdapter,
      SPACETIME_DATE_FORMATS
    } from '@devlaps/spacetime-adapter'; // Use the package name
    import { routes } from './app.routes';

    export const appTimezoneSignal: WritableSignal<string> = signal('America/New_York');

    export const appConfig: ApplicationConfig = {
      providers: [
        provideRouter(routes),
        provideAnimations(),
        provideSpacetimeAdapter(appTimezoneSignal), // Provide the adapter

        // Provide the recommended date formats
        { provide: MAT_DATE_FORMATS, useValue: SPACETIME_DATE_FORMATS }
      ]
    };
    ```

Now Angular Material components like `mat-datepicker` will use Spacetime for their date operations and react to changes in `appTimezoneSignal` (if you provided it).

## API

*   `SpacetimeAdapter`: The core `DateAdapter` implementation.
*   `provideSpacetimeAdapter(timeZoneInput?: string | Signal<string>)`: Standalone provider function. Accepts an optional timezone string or signal. If omitted, defaults to a signal containing `'UTC'`. If a string is provided, it's wrapped in a signal internally.
*   `SPACETIME_TIMEZONE`: `InjectionToken<Signal<string>>` used internally to provide the timezone signal. The adapter reads the current value from this signal.
*   `SPACETIME_DATE_FORMATS`: An object compatible with `MatDateFormats` for use with `MAT_DATE_FORMATS`.

## Building the Library

If you are working within this library's repository, you can build it using the Angular CLI:

```bash
ng build @devlaps/spacetime-adapter
# or use the project name:
ng build spacetime-adapter
```

The build artifacts will be located in the `dist/spacetime-adapter` directory.

## License

MIT License. See the [LICENSE](LICENSE) file for details.
