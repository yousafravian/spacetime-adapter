import { inject, Injectable, Signal } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

import spacetime, { Spacetime } from 'spacetime';
import { SPACETIME_TIMEZONE } from './spacetime.token';

import { range } from './utils/range';

/**
 * DateAdapter implementation that uses the Spacetime library.
 * It allows Material components like the Datepicker to work with Spacetime objects.
 * It reacts to timezone changes provided via the SPACETIME_TIMEZONE signal.
 */
@Injectable()
export class SpacetimeAdapter extends DateAdapter<Spacetime> {

  private timezone: Signal<string> = inject(SPACETIME_TIMEZONE);

  constructor() {
    super();
  }

  /**
   * Gets the year component of a Spacetime date.
   * @param date The date to extract the year from.
   * @returns The year component (e.g., 2023).
   */
  getYear( date: Spacetime ): number {
    const year = date.year();
    return year;
  }

  /**
   * Gets the month component of a Spacetime date.
   * @param date The date to extract the month from.
   * @returns The month component (0-indexed, 0 = January).
   */
  getMonth( date: Spacetime ): number {
    /**
     * Spacetime works in 1 based index
     * JS Date works in 0 based index
     * So we need to subtract 1 from the month
     */
    return date.month();
  }

  /**
   * Gets the date component of a Spacetime date.
   * @param date The date to extract the date from.
   * @returns The date component (1-indexed).
   */
  getDate( date: Spacetime ): number {
    return date.date(); // already 1 based index on both sides
  }

  /**
   * Gets the day of the week component of a Spacetime date.
   * @param date The date to extract the day of the week from.
   * @returns The day of the week (0-indexed, 0 = Sunday).
   */
  getDayOfWeek( date: Spacetime ): number {
    return date.day(); // 0 based index on both sides
  }

  /**
   * Gets the long, short, or narrow names of the months.
   * @param style The format style of the month names.
   * @returns An array of month names.
   */
  getMonthNames( style: 'long' | 'short' | 'narrow' ): string[] {
    const dtf = new Intl.DateTimeFormat( this.locale, { month: style, timeZone: 'utc' } );
    return range( 12, i => this._format( dtf, new Date( 2017, i, 1 ) ) );
  }

  /**
   * Gets the date names (1-31).
   * @returns An array of date names.
   */
  getDateNames(): string[] {
    const dtf = new Intl.DateTimeFormat( this.locale, { day: 'numeric', timeZone: 'utc' } );
    return range( 31, i => this._format( dtf, new Date( 2017, 0, i + 1 ) ) );
  }

  /**
   * Gets the long, short, or narrow names of the days of the week.
   * @param style The format style of the day names.
   * @returns An array of day names.
   */
  getDayOfWeekNames( style: 'long' | 'short' | 'narrow' ): string[] {
    const dtf = new Intl.DateTimeFormat( this.locale, { weekday: style, timeZone: 'utc' } );
    return range( 7, i => this._format( dtf, new Date( 2017, 0, i + 1 ) ) );
  }

  /**
   * Gets the name for the year of the given date.
   * @param date The date to get the year name for.
   * @returns The year name (e.g., "2023").
   */
  getYearName( date: Spacetime ): string {
    return date.format( 'year' );
  }

  /**
   * Gets the number of days in the month of the given date.
   * @param date The date to get the number of days for.
   * @returns The number of days in the month.
   */
  getNumDaysInMonth( date: Spacetime ): number {
    return date.daysInMonth();
  }

  /**
   * Clones the given date.
   * @param date The date to clone.
   * @returns A new Spacetime instance identical to the original.
   */
  clone( date: Spacetime ): Spacetime {
    return date.clone();
  }

  /**
   * Creates a Spacetime date object.
   * @param year The full year (e.g., 2023).
   * @param month The month (0-indexed, 0 = January).
   * @param date The date (1-indexed).
   * @returns The created Spacetime object.
   */
  createDate( year: number, month: number, date: number ): Spacetime {
    // Accommodate for 0 based index for month since month in param is 0-based
    return spacetime( { year, month, date }, this.timezone() );
  }

  /**
   * Gets a Spacetime object representing today's date in the configured timezone.
   * Reads the current timezone from the signal.
   * @returns Today's date.
   */
  today(): Spacetime {
    return spacetime.today( this.timezone() );
  }

  /**
   * Parses a value into a Spacetime object.
   * @param value The value to parse.
   * @param parseFormat The expected format (currently ignored, uses Spacetime's default parsing).
   * @returns The parsed Spacetime object, or null if invalid.
   */
  parse( value: any, parseFormat: any ): Spacetime | null {
    if ( !value ) return null;


    const parsedTime = this.deserialize( value );
    if ( parsedTime && this.isValid( parsedTime ) ) return parsedTime;

    return null;
  }

  /**
   * Formats a date as a string.
   * @param date The date to format.
   * @param displayFormat The format string (compatible with Spacetime's format method).
   * @returns The formatted date string.
   */
  format( date: Spacetime, displayFormat: any ): string {
    if ( !this.isValid( date ) ) {
      return 'Invalid Date';
    }

    return date.format( displayFormat );
  }

  /**
   * Adds the specified number of years to the given date.
   * @param date The date to add years to.
   * @param years The number of years to add (can be negative).
   * @returns A new Spacetime object with the added years.
   */
  addCalendarYears( date: Spacetime, years: number ): Spacetime {
    return date.add( years, 'years' );
  }

  /**
   * Adds the specified number of months to the given date.
   * @param date The date to add months to.
   * @param months The number of months to add (can be negative).
   * @returns A new Spacetime object with the added months.
   */
  addCalendarMonths( date: Spacetime, months: number ): Spacetime {
    return date.add( months, 'months' );
  }

  /**
   * Adds the specified number of days to the given date.
   * @param date The date to add days to.
   * @param days The number of days to add (can be negative).
   * @returns A new Spacetime object with the added days.
   */
  addCalendarDays( date: Spacetime, days: number ): Spacetime {
    return date.add( days, 'days' );
  }

  /**
   * Converts the given date to an ISO 8601 string.
   * @param date The date to convert.
   * @returns The ISO 8601 string representation.
   */
  toIso8601( date: Spacetime ): string {
    return date.format( 'iso' );
  }

  /**
   * Checks if the given object is a Spacetime instance.
   * @param obj The object to check.
   * @returns True if the object is a Spacetime instance, false otherwise.
   */
  isDateInstance( obj: any ): obj is Spacetime {
    // TODO: Find better alternative to check if object is a spacetime object. This works for now but might have some edge cases
    // check if constructor name of both param object and a new spacetime object is same
    const constructorName = obj?.constructor?.name;
    if ( constructorName ) {
      return constructorName === spacetime().constructor.name;
    }
    // fallback to another check
    return obj !== null && typeof obj === 'object' && typeof obj.monthName === 'function';
  }

  /**
   * Checks if the given Spacetime date is valid.
   * @param date The date to check.
   * @returns True if the date is valid, false otherwise.
   */
  isValid( date: Spacetime ): boolean {
    return date?.isValid();
  }

  /**
   * Creates an invalid Spacetime instance.
   * @returns An invalid Spacetime object.
   */
  invalid(): Spacetime {
    // create invalid spacetime instance
    return spacetime('Oops! Looks like we took a wrong turn in time.');
  }

  /**
   * Gets the first day of the week.
   * @returns The first day of the week (0 = Sunday, 1 = Monday, etc.).
   * TODO: Consider making 'startWeekOn' configurable.
   */
  getFirstDayOfWeek(): number {
    // TODO: Consider making 'startWeekOn' configurable via another injection token if needed.
    const startWeekOn = 'monday'; // Defaulting to Monday as per previous fallback
    const startWeekDays = {
      sunday: 0,
      monday: 1,
      saturday: 6,
    }
    return startWeekDays[ startWeekOn ];
  }


  /**
   * Attempts to deserialize a value to a Spacetime object.
   * Used by the Datepicker input.
   * @param value The value to deserialize.
   * @returns A valid Spacetime object, or null if the value is invalid.
   */
  override deserialize( value: any ): Spacetime | null {
    if ( !value ) return null;
    const deserializedValue = this._parse( value );

    if ( deserializedValue && !this.isValid( deserializedValue ) ) {
      console.error( 'SpacetimeAdapter: Cannot parse invalid date.' );
      return null;
    }
    return deserializedValue;
  }

  /**
   * Sets the time components on a given date object.
   * @param target The date object to modify.
   * @param hours The hours to set (0-23).
   * @param minutes The minutes to set (0-59).
   * @param seconds The seconds to set (0-59).
   * @returns A new Spacetime object with the updated time.
   */
  override setTime( target: Spacetime, hours: number, minutes: number, seconds: number ): Spacetime {
    return target.timezone( this.timezone() ).hour( hours ).minute( minutes ).second( seconds );
  }

  /**
   * Sets the locale for this adapter.
   * @param locale The locale code (e.g., 'en-US').
   */
  override setLocale( locale: any ) {
    super.setLocale( locale );
  }

  /**
   * Parses a time value into a Spacetime object.
   * @param value The value to parse (expected to be a time string or parsable object).
   * @param parseFormat The expected format (currently ignored).
   * @returns The parsed Spacetime object, or an invalid date if parsing fails.
   */
  override parseTime( value: any, parseFormat: any ): Spacetime | null {
    if ( !value ) return null;

    const parsedValue = this._parse( value );

    if ( parsedValue && this.isValid( parsedValue ) ) {
      return parsedValue;
    }

    return this.invalid();
  }

  /**
   * Adds the specified number of seconds to the given date.
   * @param date The date to add seconds to.
   * @param amount The number of seconds to add (can be negative).
   * @returns A new Spacetime object with the added seconds.
   */
  override addSeconds( date: Spacetime, amount: number ): Spacetime {
    return date.add( amount, 'seconds' );
  }

  /**
   * Gets the hours component of a Spacetime date.
   * @param date The date to extract the hours from.
   * @returns The hours component (0-23).
   */
  override getHours( date: Spacetime ): number {
    return date.hour();
  }

  /**
   * Gets the minutes component of a Spacetime date.
   * @param date The date to extract the minutes from.
   * @returns The minutes component (0-59).
   */
  override getMinutes( date: Spacetime ): number {
    return date.minute();
  }

  /**
   * Gets the seconds component of a Spacetime date.
   * @param date The date to extract the seconds from.
   * @returns The seconds component (0-59).
   */
  override getSeconds( date: Spacetime ): number {
    return date.second();
  }

  /**
   * Compares two dates.
   * @param first The first date to compare.
   * @param second The second date to compare.
   * @returns A negative number if the first date is earlier, a positive number if it's later, or 0 if they are the same.
   */
  override compareDate( first: Spacetime, second: Spacetime ): number {
    return first.epoch - second.epoch;
  }

  /**
   * Checks if two dates are the same day (ignoring time).
   * @param first The first date.
   * @param second The second date.
   * @returns True if they represent the same date, false otherwise.
   */
  override sameDate( first: Spacetime | null, second: Spacetime | null ): boolean {
    if ( !first || !second ) return false;
    return first.isSame( second, 'date' );
  }

  /**
   * Checks if two dates have the same time component.
   * @param first The first date.
   * @param second The second date.
   * @returns True if they have the same time, false otherwise.
   */
  override sameTime( first: Spacetime | null, second: Spacetime | null ): boolean {
    if ( !first || !second ) return false;

    return first.time() === second.time();
  }

  /**
   * Clamps a date between a minimum and maximum date.
   * @param date The date to clamp.
   * @param min Optional minimum date.
   * @param max Optional maximum date.
   * @returns The clamped date.
   */
  override clampDate( date: Spacetime, min: Spacetime | null, max: Spacetime | null ): Spacetime {
    if ( min && date.isBefore( min ) ) {
      return min;
    }
    if ( max && date.isAfter( max ) ) {
      return max;
    }
    return date;
  }

  /**
   * Compares the time components of two dates.
   * @param first The first date.
   * @param second The second date.
   * @returns A negative number if the first time is earlier, a positive number if it's later, or 0 if they are the same.
   */
  override compareTime( first: Spacetime, second: Spacetime ): number {
    return spacetime.now().time( first.time() ).epoch - spacetime.now().time( second.time() ).epoch;
  }

  /**
   * Gets a valid Spacetime date object or null.
   * @param obj The object to check.
   * @returns The object if it is a valid Spacetime instance, otherwise null.
   */
  override getValidDateOrNull( obj: unknown ): Spacetime | null {
    return this.isDateInstance( obj ) && obj.isValid() ? obj as Spacetime : null;
  }

  /**
   * Checks if a string appears to be only a time representation (HH:mm, hh:mm AM/PM, etc.).
   * Spacetime cannot parse *only* time values reliably, so this helps differentiate.
   * @param timeString The string to test.
   * @returns True if the string matches a common time format, false otherwise.
   * @private
   */
  private _isTimeString(timeString: string): boolean {
    // Regex matches:
    // - 12-hour format with minutes: e.g., "5:00 PM", "05:00PM", "5:00 am", "5:00AM"
    // - 12-hour format without minutes: e.g., "5 PM", "5PM", "5 am", "5AM"
    // - 24-hour format: e.g., "9:00", "09:00", "23:59"
    // Notes:
    // - Case insensitive for AM/PM markers
    // - Flexible spacing before and after AM/PM
    // - Optional minutes
    const timeRegex = /^\s*(0?[1-9]|1[0-2])(?::[0-5]\d)?\s*(?:AM|PM|am|pm|Am|Pm|aM|pM)\s*$|^\s*(?:[01]?\d|2[0-3]):[0-5]\d\s*$/i;
    return timeRegex.test(timeString);
  }

  /**
   * Formats a Date object using the provided Intl.DateTimeFormat instance.
   * Handles potential issues with years < 100.
   * COPIED FROM NATIVE DATE-ADAPTER FOR FORMAT LOGIC.
   * @param dtf The Intl.DateTimeFormat instance.
   * @param date The Date object to format.
   * @returns The formatted string.
   * @private
   */
  private _format( dtf: Intl.DateTimeFormat, date: Date ) {
    // Passing the year to the constructor causes year numbers <100 to be converted to 19xx.
    // To work around this we use `setUTCFullYear` and `setUTCHours` instead.
    const d = new Date();
    d.setUTCFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
    d.setUTCHours( date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds() );
    return dtf.format( d );
  }


  /**
   * Internal parsing logic to convert various input types to a Spacetime object.
   * Handles Spacetime instances, numbers (epochs), JS Date objects, and strings.
   * Differentiates between date/datetime strings and time-only strings using `_isTimeString`.
   * Reads the current timezone from the signal for parsing operations.
   * @param value The input value to parse.
   * @returns A Spacetime object or null if parsing is not possible.
   * @private
   */
  private _parse( value: unknown ): Spacetime | null {
    let parsedValue: Spacetime | null;
    const currentTz = this.timezone(); // Get current timezone value

    /**
     * Check if the value is a valid date instance, number or string
     */
    if ( this.isDateInstance( value ) && value.isValid() ) parsedValue = spacetime( value, currentTz );
    else if ( typeof value === 'number' ) parsedValue = spacetime( value, currentTz );
    else if ( value instanceof Date ) parsedValue = spacetime( value, currentTz );
    else if ( typeof value === 'string' ) {
      if ( this._isTimeString( value ) ) {
        // Spacetime might need a base date to parse just time, let's use today.
        parsedValue = spacetime.now(currentTz).time( value );
      }
      else {
        parsedValue = spacetime( value, currentTz );
      }
    } else {
      parsedValue = null;
    }

    return parsedValue;
  }


}
