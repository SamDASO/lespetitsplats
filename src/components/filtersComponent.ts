import { Component } from "../models/component.ts";
import { IObserver } from "../models/observer-interfaces.ts";
import { FiltersState } from "../state/filtersState.ts";
import { RecipesState } from "../state/recipesState.ts";
import { FilterComponent } from "./filterComponent.ts";

//Filters DOM

export class FiltersComponent implements Component, IObserver {
  private state: FiltersState;

  constructor(state: FiltersState) {
    this.state = state;
  }

  render(): HTMLElement {
    const filtersDisplayFirstLayer = document.createElement("div");
    filtersDisplayFirstLayer.classList.add("filters-compartement");

    //buttons
    const section = document.getElementById("filters");

    const btnsCompartement = document.createElement("div");
    btnsCompartement.classList.add("btn-compartement");

    const tagsArray: string[] = ["Ingrédients", "Appareils", "Ustensiles"];

    tagsArray.forEach((option) => {
      const container = this.createFilterContainer(option);
      btnsCompartement.appendChild(container);
    });

    //Nbr total recipes
    const recipesStateInstance = new RecipesState([]);
    const totalRecipes = recipesStateInstance.getTotalRecipes();
    const nbrRecipes = document.createElement("p");
    nbrRecipes.classList.add("nbr-recipes");
    nbrRecipes.textContent = `${totalRecipes} recettes`;

    filtersDisplayFirstLayer.appendChild(btnsCompartement);
    filtersDisplayFirstLayer.appendChild(nbrRecipes);
    section!.appendChild(filtersDisplayFirstLayer);
    const selectedFilters = this.state.getSelectedFilters();

    if (selectedFilters.length !== 0) {
      section!.appendChild(this.displaySectionFilterSelected(selectedFilters));
    }

    return section!;
  }

  private createFilterContainer(option: string): HTMLDivElement {
    const filterComponent = new FilterComponent();
    const containerFilters = document.createElement("div");
    containerFilters.classList.add("filter-container");
    containerFilters.classList.add(`filter-container-${option}`);

    const buttonTags = document.createElement("button");
    buttonTags.classList.add("filters-btn");
    buttonTags.setAttribute("aria-haspopup", "listbox");
    buttonTags.setAttribute("role", "button");
    buttonTags.textContent = option;

    const arrowDown = document.createElement("div");
    arrowDown.classList.add("arrow-down");
    arrowDown.classList.add("arrow-filter");

    containerFilters.appendChild(buttonTags);
    buttonTags.appendChild(arrowDown);

    buttonTags.addEventListener("click", () => {
      const dropdownMenu = filterComponent.render(option);
      const arrow = arrowDown;

      if (dropdownMenu.style.display === "none") {
        dropdownMenu.style.display = "flex";
        buttonTags.style.borderBottomRightRadius = "0";
        buttonTags.style.borderBottomLeftRadius = "0";
        arrow.classList.add("arrow-up");
        arrow.classList.remove("arrow-down");
      } else {
        dropdownMenu.style.display = "none";
        buttonTags.style.borderBottomRightRadius = "11px";
        buttonTags.style.borderBottomLeftRadius = "11px";
        arrow.classList.add("arrow-down");
        arrow.classList.remove("arrow-up");
      }
      containerFilters.appendChild(dropdownMenu);
    });

    return containerFilters;
  }

  displaySectionFilterSelected(selectedFilters: any) {
    const filterContainer = this.displaySelectedFilterDom(selectedFilters);
    return filterContainer;
  }

  displaySelectedFilterDom(selectedElement: string) {
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("element-selected-container");

    const filterText = document.createElement("p");
    filterText.classList.add("element-selected");
    filterText.textContent = selectedElement;

    const crossSVG = document.createElement("img");
    crossSVG.setAttribute("src", "./assets/icons/simple-cross.svg");

    filterContainer.appendChild(filterText);
    filterContainer.appendChild(crossSVG);

    crossSVG.addEventListener("click", () => {
      // Remove the selected filter and update the FiltersState
      this.state.toggleSelectedFilters(selectedElement);
      // Remove the filterContainer from the UI
      filterContainer.remove();
    });

    return filterContainer;
  }

  update() {
    this.state;
  }
}
