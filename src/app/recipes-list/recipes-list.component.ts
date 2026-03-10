import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RecipesService } from '../shared/services/recipes/recipes.service';
import { Recipe } from '../shared/models/recipe.model';
import { tuiFadeIn, tuiHeightCollapse, tuiScaleIn } from '@taiga-ui/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  animations: [tuiHeightCollapse, tuiFadeIn, tuiScaleIn],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent implements OnInit, OnDestroy {
  public recipesReceived = signal(false);
  titleControl = new FormControl('', { nonNullable: true });
  ingredientsControl = new FormControl<string[]>([], { nonNullable: true });
  public recipes$ = this.recipesService.getRecipesState();
  private destroy$ = new Subject<void>();

  hasActiveFilters(): boolean {
    const title = this.titleControl.value?.trim() ?? '';
    const ingredients = this.ingredientsControl.value?.length ?? 0;
    return title !== '' || ingredients > 0;
  }

  constructor(
    private recipesService: RecipesService,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Recipes – HomePub');
    this.recipesService.getRecipes().subscribe({
      next: () => this.recipesReceived.set(true),
      error: () => this.recipesReceived.set(true)
    });

    combineLatest([
      this.titleControl.valueChanges.pipe(startWith(this.titleControl.value)),
      this.ingredientsControl.valueChanges.pipe(startWith(this.ingredientsControl.value))
    ]).pipe(
      debounceTime(300),
      tap(() => this.recipesReceived.set(false)),
      switchMap(([title, ingredients]) =>
        this.recipesService.getRecipesByQuery(title, ingredients).pipe(
          tap({
            next: () => this.recipesReceived.set(true),
            error: () => this.recipesReceived.set(true)
          })
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  identify(index: number, item: Recipe): string | null {
    return item.id;
  }

  clearFilters(): void {
    this.titleControl.setValue('');
    this.ingredientsControl.setValue([]);
  }
}
