import {BrowserModule} from '@angular/platform-browser';
import {NgDompurifySanitizer} from "@tinkoff/ng-dompurify";
import {TUI_SANITIZER, TuiGroupModule} from "@taiga-ui/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule, ModuleWithProviders, Type} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CommonModule} from "@angular/common";
import {CabinetComponent} from './cabinet/cabinet.component';
import {RecipesListComponent} from './recipes-list/recipes-list.component';
import {
    TUI_VALIDATION_ERRORS,
} from "@taiga-ui/kit";
import {AddRecipeComponent} from './shared/modal/add-recipe/add-recipe.component';
import {RecipeDescriptionDialogComponent} from './shared/modal/recipe-description-dialog/recipe-description-dialog.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {UrlInterceptor} from "./shared/interceptors/url.interceptor";
import {RecipesService} from "./shared/services/recipes/recipes.service";
import {CatchErrorInterceptor} from "./shared/interceptors/catchError.interceptor";
import {RefreshTokenInterceptor} from "./shared/interceptors/refresh-token.interceptor";
import {RecipeCardComponent} from './recipe-card/recipe-card.component';
import {TuiSharedModuleModule} from "./shared/modules/tui-shared-module.module";
import {AuthModule} from "./auth/auth.module";
import {TokenInterceptor} from "./shared/interceptors/token.interceptor";
import {of} from "rxjs";
import {OAuthModule} from "angular-oauth2-oidc";
import { AnimatedLogoIconComponent } from "./shared/components/animated-logo-icon/animated-logo-icon.component";

const appImports: (Type<any> | ModuleWithProviders<{}>)[] = [
  BrowserModule,
  AuthModule,
  CommonModule,
  AppRoutingModule,
  RouterModule,
  HttpClientModule,
  ReactiveFormsModule,
  BrowserAnimationsModule,
  TuiSharedModuleModule,
  AnimatedLogoIconComponent,
  // Always load OAuthModule so OAuthService is available; configure at runtime when environment.oauth is set.
  OAuthModule.forRoot({
    resourceServer: {
      sendAccessToken: false,
      allowedUrls: []
    }
  }),
];

@NgModule({
  declarations: [
    AppComponent,
    CabinetComponent,
    RecipesListComponent,
    AddRecipeComponent,
    RecipeDescriptionDialogComponent,
    RecipeCardComponent
  ],
  imports: appImports,
  providers: [
    {
      provide: TUI_SANITIZER,
      useClass: NgDompurifySanitizer
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UrlInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CatchErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        required: 'This field is required',
        email: 'Please, enter a valid email',
        maxlength: ({requiredLength}: { requiredLength: string }) =>
          `Maximum length — ${requiredLength}`,
        minlength: ({requiredLength}: { requiredLength: string }) =>
          of(`Minimum length — ${requiredLength}`)
      },
    },
    RecipesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
