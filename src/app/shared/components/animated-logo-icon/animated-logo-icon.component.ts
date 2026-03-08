import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animated-logo-icon',
  templateUrl: './animated-logo-icon.component.html',
  styleUrls: ['./animated-logo-icon.component.scss'],
  standalone: true,
})
export class AnimatedLogoIconComponent {
  @Input() width: number | string = 106.47;
  @Input() height: number | string = 130;
  /** When true, adds a subtle floating animation after the entrance. */
  @Input() idle = false;
}
