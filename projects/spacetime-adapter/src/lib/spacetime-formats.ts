import { MatDateFormats } from '@angular/material/core';

/**
 * Default date formats used by the SpacetimeAdapter.
 * These formats are compatible with Material components.
 */
export const SPACETIME_DATE_FORMATS: MatDateFormats = {
  parse: {
    // For parsing input like "Feb 26, 2025"
    dateInput: null,
    timeInput: null,
  },
  display: {
    // For displaying the date in the input field (e.g. "Feb 26, 2025")
    dateInput: '{month-short} {date}, {year}',
    // Label for the month/year view (e.g. "Feb 2025")
    monthYearLabel: '{month-short} {year}',
    // Accessibility label for full date (e.g. "February 26, 2025")
    dateA11yLabel: '{month} {date}, {year}',
    // Accessibility label for month/year (e.g. "February 2025")
    monthYearA11yLabel: '{month} {year}',
    monthLabel: '{month}',
    timeInput: 'time',
    timeOptionLabel: 'time'
  }
}; 