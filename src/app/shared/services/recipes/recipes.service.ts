import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, switchMap, tap, map} from "rxjs";
import {Recipe} from "../../models/recipe.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipesState: BehaviorSubject<Recipe[] | null> = new BehaviorSubject<Recipe[] | null>(null)

  constructor(private httpClient: HttpClient) {
  }


  public getRecipes(): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>('recipes', { observe: 'response' }).pipe(
      map(res => res.body ?? []),
      tap(res => this.recipesState.next(res))
    );
  }

  public getRecipeById(id: string): Observable<Recipe> {
    return this.httpClient.get<Recipe>(`recipes/${id}`, { observe: 'response' }).pipe(
      map(res => res.body!)
    );
  }

  public createRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.httpClient.post('recipes', recipe, { observe: 'response' }).pipe(
      switchMap(() => this.getRecipes())
    )
  }

  public putRecipe(id: string, recipe: Recipe): Observable<Recipe[]> {
    return this.httpClient.put(`recipes/${id}`, recipe, { observe: 'response' }).pipe(
      switchMap(() => this.getRecipes())
    )
  }

  public getRecipesState(): Observable<Recipe[] | null> {
    return this.recipesState.asObservable();
  }

  public deleteRecipe(id: string) {
    return this.httpClient.delete(`recipes/${id}`, { observe: 'response' }).pipe(
      switchMap(() => this.getRecipes())
    );
  }
}
