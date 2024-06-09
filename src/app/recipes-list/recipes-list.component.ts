import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {RecipesService} from "../shared/services/recipes/recipes.service";
import {Recipe} from "../shared/models/recipe.model";
import {tuiFadeIn, tuiHeightCollapse, tuiScaleIn} from "@taiga-ui/core";


@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  animations: [tuiHeightCollapse, tuiFadeIn, tuiScaleIn],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent implements OnInit {
  public recipes$: Observable<Recipe[] | null> = this.recipesService.getRecipesState();

  constructor(private recipesService: RecipesService) {
  }

  ngOnInit() {
    this.recipesService.getRecipes().subscribe()
  }

  identify(index: number, item: Recipe){
    return item.title;
  }
}
