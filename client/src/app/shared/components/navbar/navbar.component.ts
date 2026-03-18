import { Component, ElementRef, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent {
  @Input() user: User | null = null;
  @Output() signOutClicked = new EventEmitter<void>();

  dropdownOpen = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);

  constructor(private elementRef: ElementRef) {}

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdownOpen.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen.set(false);
    }
  }
}
