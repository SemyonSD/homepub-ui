import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, switchMap, tap} from "rxjs";
import {Recipe} from "../../models/recipe.model";
import {ApiService} from "../api.service";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipesState: BehaviorSubject<Recipe[] | null> = new BehaviorSubject<Recipe[] | null>(null)

  constructor(private api: ApiService) {
  }


  public getRecipes(): Observable<Recipe[]> {
    return this.api.recipesGetAll().pipe(
      tap(res => this.recipesState.next(res))
    );
  }

  /** Fetches recipes filtered by title (partial, case-insensitive). Empty title loads all. */
  public getRecipesByTitle(title: string): Observable<Recipe[]> {
    const trimmed = title?.trim() ?? '';
    if (!trimmed) {
      return this.getRecipes();
    }
    return this.api.recipesGetByTitle(trimmed).pipe(
      tap(res => this.recipesState.next(res))
    );
  }

  public getRecipeById(id: string): Observable<Recipe> {
    return this.api.recipesGetById(id);
  }

  public createRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.api.recipesCreate(recipe).pipe(
      switchMap(() => this.getRecipes())
    )
  }

  public putRecipe(id: string, recipe: Recipe): Observable<Recipe[]> {
    return this.api.recipesUpdate(id, recipe).pipe(
      switchMap(() => this.getRecipes())
    )
  }

  public getRecipesState(): Observable<Recipe[] | null> {
    return this.recipesState.asObservable();
  }

  public deleteRecipe(id: string) {
    return this.api.recipesDelete(id).pipe(
      switchMap(() => this.getRecipes())
    );
  }
}
