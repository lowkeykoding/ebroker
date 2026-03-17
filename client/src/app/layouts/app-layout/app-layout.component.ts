import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: 'app-layout.component.html'
})
export class AppLayoutComponent {}
