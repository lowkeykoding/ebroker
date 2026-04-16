import {Component, HostListener, input, output, signal} from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [A11yModule],
  templateUrl: './drawer.component.html',
})
export class DrawerComponent {
  title = input.required<string>();
  text = input<string>();
  maxWidth = input<string>('max-w-md');
  submitted = output<void>();
  closed = output<void>();

  protected isOpen = signal(false);

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.closed.emit();
  }

  submit() {
    this.submitted.emit();
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.isOpen()) {
      this.close();
    }
  }
}
