import { IObserver, IObservable } from "../models/observer-interfaces.ts";
import { Filters } from "../models/filters.ts";
import { Recipe } from "../models/recipe.ts";

export class FiltersState implements IObservable, IObserver {
  private pageObservers: IObserver[] = [];
  private filterObservers: IObserver[] = [];
  private filtersList: Filters; //filters to display according to the recipes updates
  private selectedFiltersArray: string[] = []; //filters selected to generate the recipes

  constructor() {
    this.filtersList = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
    };
    this.selectedFiltersArray = [];
  }

  // As observable

  getFiltersToDisplay() {
    return this.filtersList;
  }

  getSelectedFilters() {
    return this.selectedFiltersArray;
  }

  addObserver(observer: IObserver, isPageObserver: boolean): void {
    if (isPageObserver) {
      this.pageObservers.push(observer);
    } else {
      this.filterObservers.push(observer);
    }
  }

  //notify the page with the filters selected if the argument is true, else it will notify the filter about the filters to display
  notifyObservers(isPageObserver: boolean): void {
    if (isPageObserver) {
      this.pageObservers.forEach((observer) => {
        observer.update(this.selectedFiltersArray);
      });
    } else {
      this.filterObservers.forEach((observer) => {
        observer.update(this.filterObservers);
      });
    }
  }

  // As observer update doit récupérér un Recipe[]
  update(data: any, isPageObserver: boolean): void {
    // Notify the appropriate set of observers about the changes, if isPageObserver it will notify the filter
    if (isPageObserver) {
      // Update the filters based on the data received by recipes

      this.filtersList = this.generateFilters(data);
      this.notifyObservers(false);
    } else {
      this.toggleSelectedFilters(data);
      this.notifyObservers(true);
    }
  }

  //generate the filters list depending to the recipes that are displayed by recipesState
  private generateFilters(recipes: Recipe[]): Filters {
    const filters: Filters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
    };

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        filters.ingredients.add(ingredient.ingredient);
      });
      filters.appliances.add(recipe.appliance);
      recipe.ustensils.forEach((ustensil) => {
        filters.ustensils.add(ustensil);
      });
    });

    return filters;
  }

  public toggleSelectedFilters(filter: string): void {
    const index = this.selectedFiltersArray.indexOf(filter);

    if (index !== -1) {
      // Filter is already selected, so remove it
      this.selectedFiltersArray.splice(index, 1);
    } else {
      // Filter is not selected, so add it
      this.selectedFiltersArray.push(filter);
    }
  }
}
