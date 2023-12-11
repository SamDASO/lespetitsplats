import { IObserver, IObservable } from "../models/observer-interfaces.ts";
import { Filters } from "../models/filters.ts";
import { Recipe } from "../models/recipe.ts";

export class FiltersState implements IObservable, IObserver {
  private observers: IObserver[] = [];
  private filters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  };

  constructor() {
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

  //Its observable : RecipesState
  update(recipes: Recipe[]) {
    this.filters.availableFilters = this.generateFilters(recipes);
    this.getTotalRecipes(recipes);
    this.notifyObservers();
  }

  private generateFilters(recipes: Recipe[]) {
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        this.filters.availableFilters.ingredients.add(ingredient.ingredient);
      });
      this.filters.availableFilters.appliances.add(recipe.appliance);
      recipe.ustensils.forEach((ustensil) => {
        this.filters.availableFilters.ustensils.add(ustensil);
      });
    });

    return this.filters.availableFilters;
  }

  getTotalRecipes(recipes: Recipe[]) {
    return recipes.length;
  }

  //Its observers : FiltersComponent, FilterComponent and RecipeState send them all the filters
  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    this.observers.forEach((observer) => {
      observer.update(this.filters.availableFilters);
    });
  }
}
