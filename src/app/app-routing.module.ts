import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipesListComponent} from "./recipes-list/recipes-list.component";
import {AddRecipeComponent} from "./shared/modal/add-recipe/add-recipe.component";
import {RecipeDescriptionDialogComponent} from "./shared/modal/recipe-description-dialog/recipe-description-dialog.component";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";
import {AuthComponent} from "./auth/auth.component";
import {authGuard} from "./auth/auth.guard";
import {OAuthCallbackComponent} from "./auth/oauth-callback.component";
import {CabinetComponent} from "./cabinet/cabinet.component";

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'auth/callback',
    component: OAuthCallbackComponent
  },
  {
    path: 'cabinet',
    component: CabinetComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'recipes',
        component: RecipesListComponent,
        children: [
          {
            path: ':id',
            children: [
              tuiGenerateDialogableRoute(AddRecipeComponent, {path: ''}),
              tuiGenerateDialogableRoute(RecipeDescriptionDialogComponent, {path: 'description'})
            ]
          }
        ]
      },
      {
        path: '',
        redirectTo: 'recipes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'cabinet',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
