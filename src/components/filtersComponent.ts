import { Component } from "../models/component.ts";
import { Filters } from "../models/filters.ts";
import { FiltersState } from "../state/filtersState.ts";
import { FilterComponent } from "./filterComponent.ts";

//Filters DOM

export class FiltersComponent implements Component {
  private state: FiltersState;
  private btnArray: string[];

  constructor(state: FiltersState) {
    this.state = state;
    this.btnArray = ["ingredients", "appliances", "ustensils"];
  }

  render(): HTMLElement {
    const filtersSection = document.getElementById("filters");

    /////////////////first layer Filters display (btn + nbr total recipes)

    const filtersDisplayFirstLayer = document.createElement("div");
    filtersDisplayFirstLayer.classList.add("filters-compartement");

    //container of the buttons

    const btnsCompartement = document.createElement("div");
    btnsCompartement.classList.add("btns-compartement");

    this.btnArray.forEach((option) => {
      const filterComponentInstance = new FilterComponent(this.state, option);
      const btnRender = filterComponentInstance.render();

      btnsCompartement.appendChild(btnRender);
      filtersDisplayFirstLayer.appendChild(btnsCompartement);
    });

    //Nbr total recipes
    const totalRecipes = this.state.getTotalRecipes();
    const nbrRecipes = document.createElement("p");
    nbrRecipes.classList.add("nbr-recipes");
    nbrRecipes.textContent = `${totalRecipes} recettes`;

    filtersDisplayFirstLayer.appendChild(nbrRecipes);

    /////////////////second layer Filters display (display the selected elements)

    const filtersDisplaySecondLayer = this.getSelectedFiltersSection(
      this.state.getFilters()
    );

    if (filtersSection) {
      filtersSection.appendChild(filtersDisplayFirstLayer);
      filtersSection.appendChild(filtersDisplaySecondLayer);
    }

    return filtersSection!;
  }

  private getSelectedFiltersSection(filters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  }): HTMLDivElement {
    const selectedSection = document.createElement("div");
    selectedSection.classList.add("element-selected-container");

    const selectedFilters = filters.selectedFilters;

    const selectedFiltersAsString = Object.values(selectedFilters).flatMap(
      (filtersSet) => Array.from(filtersSet as Set<string>)
    );

    if (selectedFiltersAsString.length === 0) {
      selectedSection.style.display = "none";
    } else {
      selectedSection.style.display = "flex";
      selectedFiltersAsString.forEach((element) => {
        const filterbox = document.createElement("div");
        filterbox.classList.add("element-selected-box");
        const filterText = document.createElement("p");
        filterText.classList.add("element-selected");
        filterText.textContent = element;

        const crossSVG = document.createElement("img");
        crossSVG.classList.add("close-element");
        crossSVG.setAttribute("src", "./assets/icons/simple-cross.svg");

        filterbox.appendChild(filterText);
        filterbox.appendChild(crossSVG);
        selectedSection.appendChild(filterbox);
      });
    }
    return selectedSection;
  }

  public updateFiltersComponent() {
    this.render();
  }
}
