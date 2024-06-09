import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, switchMap, tap} from "rxjs";
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
    return this.httpClient.get<Recipe[]>('recipes').pipe(
      tap(res => this.recipesState.next(res))
    );
  }

  public getRecipeById(id: string): Observable<Recipe> {
    return this.httpClient.get<Recipe>(`recipes/${id}`)
  }

  public createRecipe(recipe: Recipe): Observable<Recipe[]> {
    return this.httpClient.post<Recipe[]>('recipes', recipe).pipe(
      switchMap(() => this.getRecipes())
    )
  }

  public putRecipe(id: string, recipe: Recipe): Observable<Recipe[]> {
    return this.httpClient.put<Recipe[]>(`recipes/${id}`, recipe).pipe(
      switchMap(() => this.getRecipes())
    )
  }

  public getRecipesState(): Observable<Recipe[] | null> {
    return this.recipesState.asObservable();
  }

  public deleteRecipe(id: string) {
    return this.httpClient.delete<Recipe[]>(`recipes/${id}`).pipe(
      switchMap(() => this.getRecipes())
    );
  }
}
