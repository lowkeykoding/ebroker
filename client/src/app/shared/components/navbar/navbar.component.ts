import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="border-b border-gray-200 bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">

          <!-- Left: brand + desktop nav links -->
          <div class="flex">
            <div class="flex shrink-0 items-center">
              <span class="text-xl font-bold text-indigo-600">EBroker</span>
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a
                routerLink="/listings"
                routerLinkActive
                #rla="routerLinkActive"
                [class.border-indigo-600]="rla.isActive"
                [class.text-gray-900]="rla.isActive"
                [class.border-transparent]="!rla.isActive"
                [class.text-gray-500]="!rla.isActive"
                class="inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium hover:border-gray-300 hover:text-gray-700"
              >
                Listings
              </a>
            </div>
          </div>

          <!-- Right: notification bell + profile dropdown -->
          <div class="hidden sm:ml-6 sm:flex sm:items-center">

            <!-- Notification bell -->
            <button
              type="button"
              class="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
            >
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">View notifications</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </button>

            <!-- Profile dropdown -->
            <div class="relative ml-3">
              <button
                type="button"
                (click)="toggleDropdown($event)"
                class="relative flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">Open user menu</span>
                <div class="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium select-none">
                  A
                </div>
              </button>

              @if (dropdownOpen()) {
                <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5">
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden">Your Profile</a>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden">Settings</a>
                  <button
                    type="button"
                    (click)="logout()"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
                  >
                    Sign out
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- Mobile: hamburger button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              (click)="mobileMenuOpen.update(v => !v)"
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
            >
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              @if (!mobileMenuOpen()) {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              }
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile menu panel -->
      @if (mobileMenuOpen()) {
        <div class="sm:hidden">
          <div class="space-y-1 pt-2 pb-3">
            <a
              routerLink="/listings"
              routerLinkActive
              #rlaM="routerLinkActive"
              [class.border-indigo-600]="rlaM.isActive"
              [class.bg-indigo-50]="rlaM.isActive"
              [class.text-indigo-700]="rlaM.isActive"
              [class.border-transparent]="!rlaM.isActive"
              [class.text-gray-600]="!rlaM.isActive"
              class="block border-l-4 py-2 pr-4 pl-3 text-base font-medium hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
            >
              Listings
            </a>
          </div>

          <div class="border-t border-gray-200 pt-4 pb-3">
            <div class="flex items-center px-4">
              <div class="shrink-0">
                <div class="size-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium select-none">
                  A
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">Agent</div>
              </div>
              <button
                type="button"
                class="relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
              >
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">View notifications</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </button>
            </div>

            <div class="mt-3 space-y-1">
              <a href="#" class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">Your Profile</a>
              <a href="#" class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">Settings</a>
              <button
                type="button"
                (click)="logout()"
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      }
    </nav>
  `,
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
}
