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
    this.toogleFiltersSelection();
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
    this.toogleFiltersSelection();
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

  private getFilterOption(filter: string): keyof Filters | undefined {
    if (this.filters.availableFilters.ingredients.has(filter)) {
      return "ingredients";
    } else if (this.filters.availableFilters.appliances.has(filter)) {
      return "appliances";
    } else if (this.filters.availableFilters.ustensils.has(filter)) {
      return "ustensils";
    }
  }

  private clickHandler(element: Element) {
    const filterText = element.textContent;

    if (filterText) {
      const option = this.getFilterOption(filterText);

      if (option) {
        if (this.filters.availableFilters[option].has(filterText)) {
          // Move the filter from availableFilters to selectedFilters
          this.filters.availableFilters[option].delete(filterText);
          this.filters.selectedFilters[option].add(filterText);
        } else if (this.filters.selectedFilters[option].has(filterText)) {
          // Move the filter from selectedFilters to availableFilters
          this.filters.selectedFilters[option].delete(filterText);
          this.filters.availableFilters[option].add(filterText);
        }

        this.filtersComponent.updateFiltersComponent();
        this.notifyObservers();
      }
    }
  }

  public toogleFiltersSelection() {
    const filtersElement = document.querySelectorAll(".filtered-element-list");

    filtersElement.forEach((element) => {
      element.removeEventListener("click", () => this.clickHandler(element));
      element.addEventListener("click", () => this.clickHandler(element));
    });

    this.notifyObservers();
  }
}
