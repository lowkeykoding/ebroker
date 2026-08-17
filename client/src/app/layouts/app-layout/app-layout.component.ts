import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { routes } from '../../app.routes';
import { SvgComponent } from '../../shared/components/svg/svg.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink, SvgComponent],
  templateUrl: 'app-layout.component.html',
})
export class AppLayoutComponent {
  private authService = inject(AuthService);

  user = this.authService.currentUser;

  onSignOut(): void {
    this.authService.logout();
  }

  protected readonly sidebarRoutes = routes.find(r => r.path === '')?.children?.filter(route => route.title) ?? [];
}
