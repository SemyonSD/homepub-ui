import {Ingredient} from "../interfaces/ingredient.interface";

export class Recipe {
  id: string | null = null;
  title: string | null = null;
  ingredients: Ingredient[] | null = null;
  description: string | null = null;
  carbs?: number | null = null;
  protein?: number | null = null;
  fat?: number | null = null;
  calories?: number | null = null;
}
