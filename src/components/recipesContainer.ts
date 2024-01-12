import { Component } from "../models/component";
import { IObserver } from "../models/observer-interfaces";
import { FiltersState } from "../state/filtersState";
import { RecipesState } from "../state/recipesState";
import { RecipeComponent } from "./recipeComponent";

export class RecipesContainer implements Component, IObserver {
  private state: RecipesState;
  private filtersState: FiltersState;

  constructor(state: RecipesState, filtersState: FiltersState) {
    this.state = state;
    this.filtersState = filtersState;
  }

  render() {
    //update recipeComponent with the new recipesDisplayed array
    const containerElement = document.getElementById("recipes-section");
    containerElement!.innerHTML = "";

    const recipeComponents: RecipeComponent[] = this.state
      .getRecipesDisplayed()
      .map((recipe) => new RecipeComponent(recipe));

    recipeComponents.forEach((component) => {
      component.render();
    });

    recipeComponents.forEach((component) => {
      containerElement?.appendChild(component.render());
    });

    if (this.state.getRecipesDisplayed().length === 0) {
      containerElement!.innerHTML = "";
      let filterText = this.filtersState.getFilters().filterText;
      const errorMessage = document.createElement("p");
      errorMessage.innerHTML = `Aucune recette ne contient ’${filterText}’ vous pouvez chercher «
tarte aux pommes », « poisson », etc.`;

      containerElement!.appendChild(errorMessage);
    }
    return containerElement!;
  }

  update(): void {
    this.render();
  }
}
