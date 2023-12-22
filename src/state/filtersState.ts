import { IObserver, IObservable } from "../models/observer-interfaces.ts";
import { Filters } from "../models/filters.ts";
import { RecipesState } from "./recipesState.ts";

export class FiltersState implements IObservable, IObserver {
  private observers: IObserver[] = [];
  private filters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  };
  private recipesState: RecipesState;

  constructor(recipesState: RecipesState) {
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
    this.recipesState = recipesState;
  }

  //Its observable : RecipesState
  update() {
    this.generateFilters();
  }

  getFilters() {
    return this.filters;
  }

  //Its observers : RecipeState send them all the filters
  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    this.observers.forEach((observer) => {
      observer.update();
    });
    this.recipesState.updateRecipes(this.filters.selectedFilters);
  }

  private generateFilters() {
    const availableFilters: Filters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
    };
    const recipes = this.recipesState.getRecipesDisplayed();
    this.filters.availableFilters = availableFilters;
    const selectedFilters = this.filters.selectedFilters;

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const ingredientToLowerCase = ingredient.ingredient.toLowerCase();
        if (!selectedFilters.ingredients.has(ingredientToLowerCase)) {
          availableFilters.ingredients.add(ingredientToLowerCase);
        }
      });

      const applianceToLowerCase = recipe.appliance.toLowerCase();
      if (!selectedFilters.appliances.has(applianceToLowerCase)) {
        availableFilters.appliances.add(applianceToLowerCase);
      }

      recipe.ustensils.forEach((ustensil) => {
        const ustensilToLowerCase = ustensil.toLowerCase();
        if (!selectedFilters.ustensils.has(ustensilToLowerCase)) {
          availableFilters.ustensils.add(ustensilToLowerCase);
        }
      });
    });
  }

  public toggleFiltersSelection(option: string, filterText: string) {
    if (this.filters.availableFilters[option].has(filterText)) {
      this.clickHandlerAvailableFilters(filterText, option);
    } else if (this.filters.selectedFilters[option].has(filterText)) {
      this.clickHandlerSelectedFilters(filterText, option);
    }
    this.recipesState.updateRecipes(this.filters.selectedFilters);
    this.notifyObservers();
  }

  private clickHandlerAvailableFilters(
    filterText: string,
    option: keyof Filters
  ) {
    this.filters.availableFilters[option].delete(filterText);
    this.filters.selectedFilters[option].add(filterText);

    console.log(
      "option on clickhandler available filters",
      option,
      "filters list after clicking an available filter",
      this.filters
    );

    return this.filters;
  }

  private clickHandlerSelectedFilters(
    filterText: string,
    option: keyof Filters
  ) {
    // Move the filter from selectedFilters to availableFilters
    this.filters.selectedFilters[option].delete(filterText);
    this.filters.availableFilters[option].add(filterText);

    console.log(
      "option on clickhandler selected filters",
      option,
      "filters list after clicking a selected filter",
      this.filters
    );
    return this.filters;
  }
}
