import { Component } from "../models/component.ts";
import { Filters } from "../models/filters.ts";
import { IObserver } from "../models/observer-interfaces.ts";
import { FiltersState } from "../state/filtersState.ts";
import { FilterComponent } from "./filterComponent.ts";

//Filters DOM

export class FiltersComponent implements Component, IObserver {
  private state: FiltersState;
  private btnArray: string[];
  private filters: {
    availableFilters: Filters;
    selectedFilters: Filters;
  };

  constructor(state: FiltersState) {
    this.state = state;
    this.btnArray = ["ingredients", "appliances", "ustensils"];
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

  //Render the div containing the buttons, the total number's recipe and the display of the selected filters
  //Observes filtersState and take all the filters to display the selected filters in the container of selected filters

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

    const filtersDisplaySecondLayer = document.createElement("div");
    filtersDisplaySecondLayer.classList.add("element-selected-container");
    const selectedFilters = this.displaySelectedFilterDom();

    if (selectedFilters.length === 0) {
      filtersDisplaySecondLayer.style.display = "none";
    } else {
      filtersDisplaySecondLayer.style.display = "flex";
      selectedFilters.forEach((element) => {
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
        filtersDisplaySecondLayer.appendChild(filterbox);
      });
    }

    if (filtersSection) {
      filtersSection.appendChild(filtersDisplayFirstLayer);
      filtersSection.appendChild(filtersDisplaySecondLayer);
    }

    return filtersSection!;
  }

  private displaySelectedFilterDom(): string[] {
    return Object.values(this.filters.selectedFilters).flatMap((filtersSet) =>
      Array.from(filtersSet as Set<string>)
    );
  }

  update(filters: any) {
    this.filters.availableFilters = filters;
  }
}
