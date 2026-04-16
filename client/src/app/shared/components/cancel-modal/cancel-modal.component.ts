import { Component, inject, input, output } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-cancel-modal',
  imports: [],
  templateUrl: './cancel-modal.component.html',
  styles: ``,
})
export class CancelModalComponent {
  title = input<string>('Are you sure?');
  message = input<string>('This action cannot be undone.');
  confirmLabel = input<string>('Confirm');

  confirmed = output<void>();

  private dialogRef = inject(DialogRef<void>);

  confirm() {
    this.confirmed.emit();
    this.dialogRef.close();
  }

  dismiss() {
    this.dialogRef.close();
  }
}
