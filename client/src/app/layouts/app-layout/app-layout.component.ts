import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
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
}
