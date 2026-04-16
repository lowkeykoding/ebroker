import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: 'form-select.component.html',
})
export class FormSelectComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  id = input.required<string>();
  options = input.required<SelectOption[]>();
  required = input<boolean>(false);
  errorMessage = input<string | null>(null);
}
