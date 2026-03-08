import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, pipe, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RecipesService } from '../shared/services/recipes/recipes.service';
import { Recipe } from '../shared/models/recipe.model';
import { tuiFadeIn, tuiHeightCollapse, tuiScaleIn } from '@taiga-ui/core';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  animations: [tuiHeightCollapse, tuiFadeIn, tuiScaleIn],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent implements OnInit, OnDestroy {
  public recipes$: Observable<Recipe[] | null> = this.recipesService.getRecipesState();
  public recipesReceived = signal(false);
  filterControl = new FormControl('', { nonNullable: true });
  private destroy$ = new Subject<void>();

  constructor(private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.recipesService.getRecipes().subscribe({
      next: () => this.recipesReceived.set(true),
      error: () => this.recipesReceived.set(true)
    });

    this.filterControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.recipesReceived.set(false)),
        switchMap(value =>
          this.recipesService.getRecipesByTitle(value).pipe(
            tap({
              next: () => this.recipesReceived.set(true),
              error: () => this.recipesReceived.set(true)
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  identify(index: number, item: Recipe): string | null {
    return item.id;
  }
}
