import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthFlowService } from './oauth-flow.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-oauth-callback',
  template: `
    <div class="callback-container">
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      padding: 2rem;
    }
  `]
})
export class OAuthCallbackComponent implements OnInit {
  message = 'Completing sign in…';

  constructor(
    private oauthFlowService: OAuthFlowService,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.oauthFlowService.handleOAuthCallback().then((success) => {
      this.ngZone.run(() => {
        this.message = success ? '' : 'Sign in was cancelled or failed.';
        if (success) {
          this.authService.loadProfile().subscribe({
            next: () => this.router.navigate(['/cabinet']),
            error: () => this.router.navigate(['/cabinet']),
          });
        } else {
          this.router.navigate(['/auth']).then();
        }
      });
    }).catch((err) => {
      this.ngZone.run(() => {
        this.message = err?.message || err?.error?.message || 'Sign in failed.';
        this.router.navigate(['/auth']).then();
      });
    });
  }
}
