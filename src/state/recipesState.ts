import { RecipeComponent } from "../components/recipeComponent.ts";
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

  //needs to sort its recipes depending on each filters selected received

  public updateRecipes(selectedFilters: any) {
    // Filter recipes based on selected filters
    this.recipesDisplayed = this.allRecipes.filter((recipe) => {
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
    console.log("updates recipes after toggle:", this.recipesDisplayed);

    //update recipeComponent with the new recipesDisplayed array
    const containerElement = document.getElementById("recipes-section");
    containerElement!.innerHTML = "";
    const recipesComponents: RecipeComponent[] = this.recipesDisplayed.map(
      (recipe) => new RecipeComponent(recipe)
    );
    recipesComponents.forEach((component) => {
      component.render();
    });

    recipesComponents.forEach((component) => {
      containerElement?.appendChild(component.render());
    });
    this.notifyObservers();
  }

  private matchIngredients(
    ingredients: { ingredient: string }[],
    filterIngredients: Set<string>
  ): boolean {
    if (filterIngredients.size === 0) {
      return true;
    }
    const recipeIngredients = ingredients.map((ingredient) =>
      ingredient.ingredient.toLowerCase()
    );

    for (const filter of filterIngredients) {
      if (!recipeIngredients.includes(filter)) return false;
    }

    return true;
  }

  private matchAppliances(
    appliance: string,
    filterAppliances: Set<string>
  ): boolean {
    if (filterAppliances.size === 0) {
      return true;
    }

    for (const filter of filterAppliances) {
      if (!appliance.includes(filter)) {
        return false;
      }
    }

    return true;
  }

  private matchUstensils(
    ustensils: string[],
    filterUstensils: Set<string>
  ): boolean {
    if (filterUstensils.size === 0) {
      return true;
    }
    for (const filter of filterUstensils) {
      if (!ustensils.includes(filter)) {
        return false;
      }
    }
    return true;
  }
}
