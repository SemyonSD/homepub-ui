import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'home-pub';
  public hasToken = this.authService.token;
  public profile = this.authService.profile;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
  }

  ngOnInit(): void {
    if (this.authService.token()) {
      this.authService.loadProfile().subscribe();
    }
  }

  public logOut(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth']),
      error: () => {
        this.authService.revokeToken();
        this.router.navigate(['/auth']).then();
      }
    });
  }
}
