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

  public updateRecipes(selectedFilters: Filters, searchText: string) {
    this.recipesDisplayed = [];

    for (let i = 0; i < this.allRecipes.length; i++) {
      const recipe = this.allRecipes[i];

      if (
        this.matchIngredients(
          recipe.ingredients,
          selectedFilters.ingredients
        ) &&
        this.matchAppliances(recipe.appliance, selectedFilters.appliances) &&
        this.matchUstensils(recipe.ustensils, selectedFilters.ustensils) &&
        this.matchText(recipe, searchText)
      ) {
        this.recipesDisplayed.push(recipe);
        this.notifyObservers();
      }
    }
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

  private matchText(recipe: Recipe, searchTerm: string): boolean {
    if (searchTerm.length < 3) {
      return true;
    }
    searchTerm = searchTerm.toLowerCase();
    const nameMatch = recipe.name.toLowerCase().includes(searchTerm);
    const descriptionMatch = recipe.description
      .toLowerCase()
      .includes(searchTerm);
    const ingredientMatch = recipe.ingredients.some((ingredient) =>
      ingredient.ingredient.toLowerCase().includes(searchTerm)
    );

    return nameMatch || descriptionMatch || ingredientMatch;
  }
}
