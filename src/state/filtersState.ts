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
  update(filters: Filters) {
    this.filters.availableFilters = filters;
    this.getTotalRecipes();
  }

  getTotalRecipes() {
    const recipes = this.recipesState.getRecipesDisplayed();
    return recipes.length;
  }

  //Its observers : FiltersComponent, FilterComponent and RecipeState send them all the filters
  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    const filters = this.filters.selectedFilters;
    this.observers.forEach((observer) => {
      observer.update(filters);
    });
  }

  addFilter(filter: string) {
    const option = this.getFilterOption(filter);

    if (option) {
      this.filters.selectedFilters[option].add(filter);
    }

    return this.filters.selectedFilters;
  }

  removeFilter(filter: string) {
    const option = this.getFilterOption(filter);

    if (option) {
      this.filters.selectedFilters[option].delete(filter);
    }

    return this.filters.selectedFilters;
  }

  private getFilterOption(filter: string): keyof Filters | undefined {
    if (this.filters.availableFilters.ingredients.has(filter)) {
      return "ingredients";
    } else if (this.filters.availableFilters.appliances.has(filter)) {
      return "appliances";
    } else if (this.filters.availableFilters.ustensils.has(filter)) {
      return "ustensils";
    }
  }
}
