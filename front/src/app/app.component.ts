import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './servicos/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [MatToolbarModule, MatButtonModule, RouterModule],
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  private token = signal(this.auth.getToken());

  logado = computed(() => !!this.token());

  logout() {
    this.auth.logout();
    this.token.set(null);
    this.router.navigateByUrl('/login');
  }
}
