import { IObservable, IObserver } from "../models/observer-interfaces.ts";
import { Recipe } from "../models/recipe.ts";
import { Filters } from "../models/filters.ts";
import { FiltersState } from "./filtersState.ts";

export class RecipesState implements IObservable, IObserver {
  private observers: IObserver[] = [];
  private recipesDisplayed: Recipe[] = [];
  private readonly allRecipes: Recipe[] = [];

  constructor(observers: IObserver[], initialRecipes?: Recipe[]) {
    this.allRecipes = initialRecipes || [];
    this.recipesDisplayed = this.allRecipes;
    this.observers = observers;
  }

  //As Observable

  getRecipesDisplayed(): Recipe[] {
    return this.recipesDisplayed;
  }

  getTotalRecipes(): number {
    return this.recipesDisplayed.length;
  }

  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  //Notify the FiltersState about the recipes that are displayed
  notifyObservers(): void {
    let recipesUpdate: Recipe[];
    if (this.recipesDisplayed.length == 0) {
      recipesUpdate = this.allRecipes;
    } else {
      const filtersState = new FiltersState();
      recipesUpdate = this.update(
        filtersState.generatedFiltersFunction(this.allRecipes)
      );
    }
    this.observers.forEach((observer) => observer.update(recipesUpdate, true));
  }

  //As observer

  update(filters: any): Recipe[] {
    const updatedRecipes = this.filterRecipes(filters); // recived by filters that have been selected by filter
    this.notifyObservers(); //notify the Filters
    return updatedRecipes;
  }

  private filterRecipes(filters: Filters) {
    this.recipesDisplayed = this.allRecipes.filter((recipe) => {
      const ingredientsMatch = this.matchIngredients(
        recipe.ingredients,
        filters.ingredients
      );
      const appliancesMatch = this.matchAppliances(
        recipe.appliance,
        filters.appliances
      );
      const ustensilsMatch = this.matchUstensils(
        recipe.ustensils,
        filters.ustensils
      );

      return ingredientsMatch && appliancesMatch && ustensilsMatch;
    });
    return this.recipesDisplayed;
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
