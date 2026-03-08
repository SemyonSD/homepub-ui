import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal, WritableSignal} from '@angular/core';
import {AuthService} from "./auth.service";
import {OAuthFlowService} from "./oauth-flow.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, finalize, switchMap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {HttpError} from "../shared/interfaces/http-error.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {TuiValidationError} from "@taiga-ui/cdk";

interface AuthForm {
  username: FormControl<string | null>,
  password: FormControl<string | null>
}

interface SignUpForm {
  name: FormControl<string | null>,
  surname: FormControl<string | null>,
  username: FormControl<string | null>,
  password: FormControl<string | null>
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: []
})
export class AuthComponent implements OnInit {

  public authForm: FormGroup = new FormGroup<AuthForm>({
    username: new FormControl<string | null>(null, {validators: Validators.required}),
    password: new FormControl<string | null>(null, {validators: Validators.required})
  });
  public signUpForm: FormGroup = new FormGroup<SignUpForm>({
    name: new FormControl<string | null>(null, {validators: Validators.required}),
    surname: new FormControl<string | null>(null, {validators: Validators.required}),
    username: new FormControl<string | null>(null, {validators: Validators.required}),
    password: new FormControl<string | null>(null, {validators: Validators.required})
  });

  public showLoader: boolean = false;
  public carouselIndexSignal: WritableSignal<number> = signal(0);
  public userFieldSignal: WritableSignal<string[]> = signal([]);

  constructor(public authService: AuthService, public oauthFlowService: OAuthFlowService, private router: Router, private cd: ChangeDetectorRef) {
  }

  public ngOnInit() {
  }

  public signIn(): void {
    this.authForm.markAllAsTouched();
    this.authForm.get('username')?.markAsDirty();
    this.authForm.updateValueAndValidity();
    if (this.authForm.invalid) {
      return;
    }
    this.showLoader = true;
    this.authForm.disable({emitEvent: false})
    this.authService.signIn(this.authForm.value).pipe(
      catchError((err: HttpErrorResponse) => {
        const errorDescription: HttpError = err.error;
        const fieldError = errorDescription.message;
        this.userFieldSignal.set([fieldError]);
        return throwError(() => err);
      }),
      switchMap(() => this.authService.loadProfile()),
      switchMap(() => {
        return fromPromise(this.router.navigate(['/cabinet']));
      }),
      finalize(() => {
        this.showLoader = false;
        this.authForm.enable({emitEvent: false});
      })
    ).subscribe();
  }

  public signUp(): void {
    this.showLoader = true;
    this.signUpForm.disable({emitEvent: false})
    this.authService.signUp(this.signUpForm.value).pipe(
      finalize(() => {
        this.carouselIndexSignal.set(0);
        this.showLoader = false;
        this.signUpForm.enable({emitEvent: false});
        this.authForm.reset(null, {emitEvent: false})
        this.signUpForm.reset(null, {emitEvent: false})
      })
    ).subscribe();
  }

  public setIndex(idx: number): void {
    this.carouselIndexSignal.set(idx);
  }

  public loginWithOAuth(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.oauthFlowService.loginWithOAuth();
  }
}
