import { IObservable, IObserver } from "../models/observer-interfaces.ts";
import { Recipe } from "../models/recipe.ts";
import { Filters } from "../models/filters.ts";

export class RecipesState implements IObservable, IObserver {
  private observers: IObserver[] = [];
  private recipesDisplayed: Recipe[] = [];

  constructor(observers: IObserver[], recipes: Recipe[]) {
    this.recipesDisplayed = recipes;
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
    this.observers.forEach((observer) =>
      observer.update(this.recipesDisplayed)
    );
  }

  //As observer

  update(filters: Filters) {
    const filtersSelected = filters.selectedFilters;
    this.updateRecipes(filtersSelected);
  }

  //needs to sort its recipes depending on each filters selected received

  private updateRecipes(selectedFilters: any) {
    // Filter recipes based on selected filters
    this.recipesDisplayed = this.recipesDisplayed.filter((recipe) => {
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

    this.notifyObservers();
  }

  private matchIngredients(
    ingredients: { ingredient: string }[],
    filterIngredients: Set<string>
  ): boolean {
    const recipeIngredients = ingredients.map((ingredient) =>
      ingredient.ingredient.toLowerCase()
    );
    return (
      filterIngredients.size === 0 ||
      recipeIngredients.every((ingredient) => filterIngredients.has(ingredient))
    );
  }

  private matchAppliances(
    appliance: string,
    filterAppliances: Set<string>
  ): boolean {
    return filterAppliances.size === 0 || filterAppliances.has(appliance);
  }

  private matchUstensils(
    ustensils: string[],
    filterUstensils: Set<string>
  ): boolean {
    return (
      filterUstensils.size === 0 ||
      ustensils.some((ustensil) => filterUstensils.has(ustensil))
    );
  }
}
