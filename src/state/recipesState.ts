import { IObservable, IObserver } from "../models/observer-interfaces.ts";
import { Recipe } from "../models/recipe.ts";
import { Filters } from "../models/filters.ts";

export class RecipesState implements IObservable, IObserver {
  private observers: IObserver[] = [];
  private recipesDisplayed: Recipe[] = [];
  private allRecipes: Recipe[] = [];
  private filters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  };

  constructor(observers: IObserver[], initialRecipes: Recipe[]) {
    this.allRecipes = initialRecipes || [];
    this.recipesDisplayed = this.allRecipes.slice();
    this.observers = observers;
    this.filters = {
      availableFilters: {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
      },
      selectedFilters: {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
      },
    };
  }

  //As Observable
  //needs to be observed by the recipeComponent
  getRecipesDisplayed(): Recipe[] {
    return this.recipesDisplayed;
  }

  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  //Notify the FiltersState and filtersComponent about the recipes that are displayed
  notifyObservers(): void {
    let recipesUpdate: Recipe[];
    if (this.recipesDisplayed.length == 0) {
      recipesUpdate = this.allRecipes;
    } else {
      recipesUpdate = this.recipesDisplayed;
    }
    this.observers.forEach((observer) => observer.update(recipesUpdate));
  }

  //As observer

  update(filters: Filters): Recipe[] {
    this.filters.availableFilters = filters;
    this.recipesDisplayed = this.filterRecipes(filters); // recived by filters that have been selected by filter
    this.notifyObservers(); //notify the Filters
    console.log("update for RecipesState:", filters);
    return this.recipesDisplayed;
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
