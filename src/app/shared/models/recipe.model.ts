import {Ingredient} from "../interfaces/ingredient.interface";

export class Recipe {
  id: string | null = null;
  title: string | null = null;
  ingredients: Ingredient[] | null = null;
  description: string | null = null;
}
