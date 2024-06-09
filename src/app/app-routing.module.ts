import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipesListComponent} from "./recipes-list/recipes-list.component";
import {AddRecipeComponent} from "./shared/modal/add-recipe/add-recipe.component";
import {tuiGenerateDialogableRoute} from "@taiga-ui/kit";

const routes: Routes = [
  {
    path: 'recipes',
    component: RecipesListComponent,
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
