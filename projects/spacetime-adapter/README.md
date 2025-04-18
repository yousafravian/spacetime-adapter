# Spacetime Adapter for Angular Material

[![npm version](https://badge.fury.io/js/spacetime-adapter.svg)](https://badge.fury.io/js/spacetime-adapter) <!-- Optional: Add badge if published -->

This library provides a `DateAdapter` implementation for Angular Material that uses the [Spacetime](https://github.com/spencermountain/spacetime) library. This allows you to use Spacetime objects seamlessly with Angular Material components like the Datepicker, while also leveraging Spacetime's powerful timezone handling capabilities.

## Features

*   Integrates `spacetime` with Angular Material's `DateAdapter`.
*   Provides correct date and time handling respecting timezones.
*   Uses Spacetime's parsing and formatting.
*   Configurable default timezone via an Injection Token.
*   Standalone API using provider functions.

## Dependencies

This library relies on the following peer dependencies:

*   `@angular/core`
*   `@angular/material`
*   `spacetime`

You need to have these installed in your project.

```bash
# Using npm
npm install @angular/core @angular/material spacetime

# Using pnpm
pnpm add @angular/core @angular/material spacetime
```

## Installation

```bash
# Using npm
npm install spacetime-adapter # Replace with your actual package name if different

# Using pnpm
pnpm add spacetime-adapter # Replace with your actual package name if different
```

*(Note: Replace `spacetime-adapter` with the actual package name if you publish it under a different name.)*

## Usage

This library is designed for standalone Angular applications.

1.  **Provide the Adapter and Timezone:**

    In your application's bootstrap function (e.g., `main.ts` or `app.config.ts`), use the `provideSpacetimeAdapter` function.

    ```typescript
    // src/app/app.config.ts
    import { ApplicationConfig } from '@angular/core';
    import { provideProtractorTestingSupport } from '@angular/platform-browser';
    import { provideRouter } from '@angular/router';
    import { provideSpacetimeAdapter } from 'spacetime-adapter'; // Adjust path/package name
    import { routes } from './app.routes';

    export const appConfig: ApplicationConfig = {
      providers: [
        provideRouter(routes),
        provideProtractorTestingSupport(), // Example other provider

        // Provide the Spacetime adapter
        // Defaults to 'UTC' if no timezone is specified
        provideSpacetimeAdapter()

        // Or provide a specific default timezone:
        // provideSpacetimeAdapter('America/New_York')
      ]
    };
    ```

2.  **Provide Date Formats (Optional but Recommended):**

    You should also provide the `MAT_DATE_FORMATS` token using the exported `SPACETIME_DATE_FORMATS` object.

    ```typescript
    // src/app/app.config.ts
    import { ApplicationConfig } from '@angular/core';
    import { provideProtractorTestingSupport } from '@angular/platform-browser';
    import { provideRouter } from '@angular/router';
    import { MAT_DATE_FORMATS } from '@angular/material/core';
    import {
      provideSpacetimeAdapter,
      SPACETIME_DATE_FORMATS
    } from 'spacetime-adapter'; // Adjust path/package name
    import { routes } from './app.routes';

    export const appConfig: ApplicationConfig = {
      providers: [
        provideRouter(routes),
        provideProtractorTestingSupport(),
        provideSpacetimeAdapter(), // Provide the adapter

        // Provide the recommended date formats
        { provide: MAT_DATE_FORMATS, useValue: SPACETIME_DATE_FORMATS }
      ]
    };
    ```

Now Angular Material components like `mat-datepicker` will use Spacetime for their date operations.

## API

*   `SpacetimeAdapter`: The core `DateAdapter` implementation.
*   `provideSpacetimeAdapter(defaultTimezone?: string)`: Standalone provider function to configure the adapter and default timezone.
*   `SPACETIME_TIMEZONE`: `InjectionToken<string>` used internally to provide the timezone. You can also provide this token yourself if you need more complex logic for determining the timezone.
*   `SPACETIME_DATE_FORMATS`: An object compatible with `MatDateFormats` for use with `MAT_DATE_FORMATS`.

## Building the Library

If you are working within this library's repository, you can build it using the Angular CLI:

```bash
ng build spacetime-adapter
```

The build artifacts will be located in the `dist/spacetime-adapter` directory.

## License

[MIT License](LICENSE) <!-- Optional: Create a LICENSE file -->
