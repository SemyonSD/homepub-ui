import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipesListComponent} from "./recipes-list/recipes-list.component";
import {AddRecipeComponent} from "./shared/modal/add-recipe/add-recipe.component";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";
import {AuthComponent} from "./auth/auth.component";
import {authGuard} from "./auth/auth.guard";

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'recipes',
    component: RecipesListComponent,
    canActivate: [authGuard],
    children: [tuiGenerateDialogableRoute(AddRecipeComponent, {path: `:id`})]
  },
  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
