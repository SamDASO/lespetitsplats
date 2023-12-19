import { IObserver, IObservable } from "../models/observer-interfaces.ts";
import { Filters } from "../models/filters.ts";
import { RecipesState } from "./recipesState.ts";
import { Recipe } from "../models/recipe.ts";
import { FiltersComponent } from "../components/filtersComponent.ts";

export class FiltersState implements IObservable, IObserver {
  private observers: IObserver[] = [];
  private filters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  };
  private recipesState: RecipesState;
  private filtersComponent: FiltersComponent;

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
    this.filtersComponent = new FiltersComponent(this);
  }

  //Its observable : RecipesState
  update(recipes: Recipe[]) {
    this.generateFilters(recipes);
    this.getTotalRecipes();
  }

  getTotalRecipes() {
    const recipes = this.recipesState.getRecipesDisplayed();
    return recipes.length;
  }

  getFilters() {
    return this.filters;
  }

  //Its observers : RecipeState send them all the filters
  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    const filters = this.filters;
    this.observers.forEach((observer) => {
      observer.update(filters);
    });
  }

  //TOLOWERCASE
  private generateFilters(recipes: Recipe[]) {
    const availableFilters: Filters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
    };

    this.filters.availableFilters = availableFilters;

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        availableFilters.ingredients.add(ingredient.ingredient.toLowerCase());
      });
      availableFilters.appliances.add(recipe.appliance.toLowerCase());
      recipe.ustensils.forEach((ustensil) => {
        availableFilters.ustensils.add(ustensil.toLowerCase());
      });
    });
  }

  public toggleFiltersSelection() {
    const filtersElement = document.querySelectorAll(".filtered-element-list");

    filtersElement.forEach((element) => {
      element.addEventListener("click", () => {
        const filterText = element.textContent as string;
        const option = (element as HTMLElement).dataset.option as keyof Filters;

        if (this.filters.availableFilters[option].has(filterText)) {
          this.clickHandlerAvailableFilters(filterText, option);
        } else if (this.filters.selectedFilters[option].has(filterText)) {
          this.clickHandlerSelectedFilters(filterText, option);
        }
        return this.filters;
      });
    });
    this.filtersComponent.updateFiltersComponent(this.filters);
    this.notifyObservers();
  }

  private clickHandlerAvailableFilters(
    filterText: string,
    option: keyof Filters
  ) {
    this.filters.availableFilters[option].delete(filterText);
    this.filters.selectedFilters[option].add(filterText);

    console.log("option on clickhandler available filters", option);
    console.log(
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

    console.log("option on clickhandler selected filters", option);
    console.log("filters list after clicking a selected filter", this.filters);
    return this.filters;
  }
}
