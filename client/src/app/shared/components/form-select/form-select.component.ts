import { Component, input } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [FormField],
  templateUrl: 'form-select.component.html',
})
export class FormSelectComponent {
  field = input.required<Field<any>>();
  label = input.required<string>();
  id = input.required<string>();
  options = input.required<SelectOption[]>();
  errorMessage = input<string | null>(null);
}
