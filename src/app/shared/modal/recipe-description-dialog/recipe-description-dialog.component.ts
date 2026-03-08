import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { RecipesService } from '../../services/recipes/recipes.service';

@Component({
  selector: 'app-recipe-description-dialog',
  templateUrl: './recipe-description-dialog.component.html',
  styleUrls: ['./recipe-description-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDescriptionDialogComponent implements OnInit {
  recipe: Recipe | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private recipesService: RecipesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.parent?.snapshot.paramMap.get('id');
    if (id) {
      this.recipesService.getRecipeById(id).subscribe((r) => {
        this.recipe = r;
        this.cdr.markForCheck();
      });
    }
  }

  close(): void {
    this.router.navigate(['/cabinet/recipes']);
  }
}
