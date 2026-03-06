import {ChangeDetectionStrategy, Component, input, Input} from '@angular/core';
import {Recipe} from "../shared/models/recipe.model";
import {RecipesService} from "../shared/services/recipes/recipes.service";
import {ActivatedRoute, Router} from "@angular/router";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCardComponent {
  public recipe = input<Recipe | null>(null);
  public isSubMenuOpen: boolean = false;

  constructor(private recipesService: RecipesService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  public showRecipeDescription(): void {
    const id = this.recipe()?.id;
    if (id) {
      this.router.navigate([id, 'description'], { relativeTo: this.activatedRoute });
    }
  }

  public deleteRecipe() {
    if (!this.recipe()?.id) {
      throw Error('Id not found')
    }
    this.recipesService.deleteRecipe(this.recipe()?.id as string).subscribe()
  }

  public editRecipe() {
    fromPromise(this.router.navigate([this.recipe()?.id], {relativeTo: this.activatedRoute})).subscribe(() => {
      this.toggleSubMenu();
    })
  }

  public toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
}
