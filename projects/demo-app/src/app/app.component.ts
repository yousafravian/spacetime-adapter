import { Component, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Spacetime } from 'spacetime';
import { CommonModule, JsonPipe } from '@angular/common';

import { appTimezoneSignal } from '../app/app.config'; // Import the shared signal

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    JsonPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Use the shared timezone signal from app.config
  timezoneSignal: WritableSignal<string> = appTimezoneSignal;

  // Date control for the datepicker
  dateControl = new FormControl<Spacetime | null>(null);

  // List of example timezones for the dropdown
  availableTimezones: string[] = [
    'UTC',
    'Europe/London',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  // Update the shared signal when the select dropdown changes
  onTimezoneChange(newTimezone: string): void {
    this.timezoneSignal.set(newTimezone);
  }
}
