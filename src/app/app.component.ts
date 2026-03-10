import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'home-pub';
  public hasToken = this.authService.token;
  public profile = this.authService.profile;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
  }

  ngOnInit(): void {
    if (this.authService.token()) {
      this.authService.loadProfile().subscribe();
    }
  }

  public logOut(): void {
    const refreshToken = this.authService.getRefreshToken();
    this.authService.revokeToken();
    this.cdr.detectChanges();

    this.authService.logoutBackend(refreshToken).subscribe({
      next: () => this.router.navigate(['/auth']),
      error: () => this.router.navigate(['/auth']),
    });
  }
}
