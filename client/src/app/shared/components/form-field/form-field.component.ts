import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: 'form-field.component.html',
})
export class FormFieldComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  id = input.required<string>();
  type = input<string>('text');
  required = input<boolean>(false);
  autocomplete = input<string | null>(null);
  errors = input<Record<string, string>>({});

  get errorEntries(): { key: string; message: string }[] {
    return Object.entries(this.errors()).map(([key, message]) => ({ key, message }));
  }
}
