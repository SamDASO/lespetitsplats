import { Filters } from "../models/filters.ts";
import { IObservable, IObserver } from "../models/observer-interfaces.ts";
import { Recipe } from "../models/recipe.ts";
export class RecipesState implements IObservable {
  private observers: IObserver[] = [];
  private recipesDisplayed: Recipe[] = [];
  private readonly allRecipes: Recipe[];

  constructor(observers: IObserver[], initialRecipes: Recipe[]) {
    this.allRecipes = initialRecipes;
    this.recipesDisplayed = this.allRecipes;
    this.observers = observers;
  }

  //As Observable
  //needs to be observed by the recipeComponent
  getRecipesDisplayed(): Recipe[] {
    return this.recipesDisplayed;
  }

  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  //Notify the FiltersState
  notifyObservers(): void {
    this.observers.forEach((observer) => observer.update());
  }

  //needs to sort its recipes depending on each filters selected received

  public updateRecipes(selectedFilters: Filters) {
    // Filter recipes based on selected filters
    this.recipesDisplayed = this.allRecipes.filter((recipe) => {
      const ingredientsMatch = this.matchIngredients(
        recipe.ingredients,
        selectedFilters.ingredients
      );
      const appliancesMatch = this.matchAppliances(
        recipe.appliance,
        selectedFilters.appliances
      );
      const ustensilsMatch = this.matchUstensils(
        recipe.ustensils,
        selectedFilters.ustensils
      );

      return ingredientsMatch && appliancesMatch && ustensilsMatch;
    });
    console.log("updates recipes after toggle:", this.recipesDisplayed);

    this.notifyObservers();
  }

  private matchIngredients(
    ingredients: { ingredient: string }[],
    filterIngredients: Set<string>
  ): boolean {
    if (filterIngredients.size === 0) {
      return true;
    }

    const recipeIngredientSet = new Set(
      ingredients.map((ingredient) => ingredient.ingredient.toLowerCase())
    );

    // Check if the recipe contains all of the selected ingredients
    return Array.from(filterIngredients).every((filter) =>
      recipeIngredientSet.has(filter)
    );
  }

  private matchAppliances(
    appliance: string,
    filterAppliances: Set<string>
  ): boolean {
    if (filterAppliances.size === 0) {
      return true;
    }

    const applianceName = appliance.toLowerCase();

    return filterAppliances.has(applianceName);
  }

  private matchUstensils(
    ustensils: string[],
    filterUstensils: Set<string>
  ): boolean {
    if (filterUstensils.size === 0) {
      return true;
    }

    const recipeUstensilSet = new Set(
      ustensils.map((ustensil) => ustensil.toLowerCase())
    );

    // Check if the recipe contains all of the selected ustensils
    return Array.from(filterUstensils).every((filter) =>
      recipeUstensilSet.has(filter)
    );
  }
}
