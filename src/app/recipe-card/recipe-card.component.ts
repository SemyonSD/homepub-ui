import {Component, Input} from '@angular/core';
import {Recipe} from "../shared/models/recipe.model";
import {RecipesService} from "../shared/services/recipes/recipes.service";
import {ActivatedRoute, Router} from "@angular/router";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {
  @Input() public recipe: Recipe | null = null;
  public expanded: boolean = false;
  public isSubMenuOpen: boolean = false;

  constructor(private recipesService: RecipesService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  public toggle(): void {
    this.expanded = !this.expanded;
  }

  public deleteRecipe() {
    if (!this.recipe?._id) {
      throw Error('Id not found')
    }
    this.recipesService.deleteRecipe(this.recipe?._id as string).subscribe(() => this.toggle())
  }

  public editRecipe() {
    fromPromise(this.router.navigate([this.recipe?._id], {relativeTo: this.activatedRoute})).subscribe(() => {
      this.toggleSubMenu();
    })
  }

  public toggleSubMenu() {
    this.isSubMenuOpen = !this.isSubMenuOpen;
  }
}
