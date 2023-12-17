import { Component } from "../models/component.ts";
import { Filters } from "../models/filters.ts";
import { FiltersState } from "../state/filtersState.ts";
import { FilterComponent } from "./filterComponent.ts";

//Filters DOM

export class FiltersComponent implements Component {
  private state: FiltersState;
  private btnArray: string[];
  private selectedSection: HTMLDivElement;
  private filterComponents: FilterComponent[];

  constructor(state: FiltersState) {
    this.state = state;
    this.btnArray = ["ingredients", "appliances", "ustensils"];
    this.selectedSection = document.createElement("div");
    this.filterComponents = this.btnArray.map(
      (option) => new FilterComponent(this.state, option)
    );
  }

  render(): HTMLElement {
    const filtersSection = document.getElementById("filters");

    /////////////////first layer Filters display (btn + nbr total recipes)

    let filtersDisplayFirstLayer = document.getElementById(
      "filtersDisplayFirstLayer"
    ) as HTMLDivElement;

    if (!filtersDisplayFirstLayer) {
      filtersDisplayFirstLayer = document.createElement("div");
      filtersDisplayFirstLayer.id = "filtersDisplayFirstLayer";
      filtersDisplayFirstLayer.classList.add("filters-compartement");

      const btnsCompartement = document.createElement("div");
      btnsCompartement.classList.add("btns-compartement");

      //container of the buttons

      this.filterComponents.forEach((filterComponent) => {
        const btnRender = filterComponent.render();
        btnsCompartement.appendChild(btnRender);
      });

      //Nbr total recipes
      const totalRecipes = this.state.getTotalRecipes();
      const nbrRecipes = document.createElement("p");
      nbrRecipes.classList.add("nbr-recipes");
      nbrRecipes.textContent = `${totalRecipes} recettes`;
      filtersDisplayFirstLayer.appendChild(btnsCompartement);
      filtersDisplayFirstLayer.appendChild(nbrRecipes);
    }

    /////////////////second layer Filters display (display the selected elements)

    const filtersDisplaySecondLayer = this.selectedSection;
    filtersDisplaySecondLayer.classList.add("element-selected-container");
    filtersDisplaySecondLayer.innerHTML = "";

    const filtersSelectedBoxes = this.getSelectedFiltersSection(
      this.state.getFilters()
    );

    // Append each filter box individually
    filtersSelectedBoxes.forEach((filterBox) => {
      filtersDisplaySecondLayer.appendChild(filterBox);
    });

    if (filtersSection) {
      filtersSection.appendChild(filtersDisplayFirstLayer);
      filtersSection.appendChild(filtersDisplaySecondLayer);
    }

    return filtersSection!;
  }

  private getSelectedFiltersSection(filters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  }): HTMLDivElement[] {
    const selectedFilters = filters.selectedFilters;

    const selectedFiltersAsString = Object.values(selectedFilters).flatMap(
      (filtersSet) => Array.from(filtersSet as Set<string>)
    );

    const filterBoxes: HTMLDivElement[] = [];

    selectedFiltersAsString.forEach((element) => {
      const filterBox = this.createFilterBox(element);
      filterBoxes.push(filterBox);
    });

    if (selectedFiltersAsString.length === 0) {
      this.selectedSection.style.display = "none";
    } else {
      this.selectedSection.style.display = "flex";
    }

    return filterBoxes;
  }

  private createFilterBox(element: string): HTMLDivElement {
    const filterBox = document.createElement("div");
    filterBox.classList.add("element-selected-box");
    const filterText = document.createElement("p");
    filterText.classList.add("element-selected");
    filterText.textContent = element;

    const crossSVG = document.createElement("img");
    crossSVG.classList.add("close-element");
    crossSVG.setAttribute("src", "../assets/icons/simple-cross.svg");

    filterBox.appendChild(filterText);
    filterBox.appendChild(crossSVG);

    return filterBox;
  }

  public updateFiltersComponent() {
    this.render();
  }
}
