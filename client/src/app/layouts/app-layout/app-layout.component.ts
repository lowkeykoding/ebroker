import { Component, inject } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import {routes} from '../../app.routes';
import {SvgComponent} from '../../shared/components/svg/svg.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink, SvgComponent],
  templateUrl: 'app-layout.component.html',
})
export class AppLayoutComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  // Signal reference — template reads user() to get current value
  user = this.supabaseService.currentUser;

  async onSignOut(): Promise<void> {
    await this.supabaseService.signOut();
    this.router.navigateByUrl('/auth/login');
  }

  protected readonly sidebarRoutes = routes.at(0)?.children?.filter(route => route.title) ?? [];
}
