import {NgDompurifySanitizer} from "@tinkoff/ng-dompurify";
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiThemeNightModule,
  TuiModeModule,
  TuiSvgModule,
  TuiButtonModule,
  TuiTextfieldControllerModule,
  TuiHostedDropdownModule,
  TuiExpandModule,
  TuiErrorModule
} from "@taiga-ui/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CommonModule} from "@angular/common";
import {RecipesListComponent} from './recipes-list/recipes-list.component';
import {TuiBlockStatusModule} from "@taiga-ui/layout";
import {
  TuiActionModule,
  TuiInputModule,
  TuiInputTagModule,
  TuiRoutableDialogModule,
  TuiTagModule,
  TuiTextAreaModule
} from "@taiga-ui/kit";
import {AddRecipeComponent} from './shared/modal/add-recipe/add-recipe.component';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {UrlInterceptor} from "./shared/interceptors/url.interceptor";
import {RecipesService} from "./shared/services/recipes/recipes.service";
import {CatchErrorInterceptor} from "./shared/interceptors/catchError.interceptor";
import { RecipeCardComponent } from './recipe-card/recipe-card.component';

@NgModule({
  declarations: [
    AppComponent,
    RecipesListComponent,
    AddRecipeComponent,
    RecipeCardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiThemeNightModule,
    TuiModeModule,
    TuiSvgModule,
    TuiBlockStatusModule,
    TuiTagModule,
    TuiButtonModule,
    TuiActionModule,
    TuiRoutableDialogModule,
    TuiInputModule,
    TuiInputTagModule,
    TuiTextfieldControllerModule,
    TuiHostedDropdownModule,
    TuiExpandModule,
    TuiTextAreaModule,
    TuiErrorModule,
  ],
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
    RecipesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
