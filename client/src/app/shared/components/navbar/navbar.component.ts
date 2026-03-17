import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
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

  logout(): void {
    console.log('logout');
  }

  protected readonly Boolean = Boolean;
}
