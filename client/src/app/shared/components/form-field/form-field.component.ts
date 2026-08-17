import { Component, input } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [FormField],
  templateUrl: 'form-field.component.html',
})
export class FormFieldComponent {
  field = input.required<Field<any>>();
  label = input.required<string>();
  id = input.required<string>();
  type = input<string>('text');
  autocomplete = input<string | null>(null);
  errors = input<Record<string, string>>({});

  get errorEntries(): { key: string; message: string }[] {
    return Object.entries(this.errors()).map(([key, message]) => ({ key, message }));
  }

  hasError(kind: string): boolean {
    return this.field()().errors().some(e => e.kind === kind);
  }
}
