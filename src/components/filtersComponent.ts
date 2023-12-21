import { Component } from "../models/component.ts";
import { IObservable, IObserver } from "../models/observer-interfaces.ts";
import { FiltersState } from "../state/filtersState.ts";
import { RecipesState } from "../state/recipesState.ts";
import { FilterComponent } from "./filterComponent.ts";

//Filters DOM

export class FiltersComponent implements Component, IObserver, IObservable {
  private filtersState: FiltersState;
  private recipesState: RecipesState;
  private btnArray: string[];
  private selectedSection: HTMLDivElement;
  private filterComponents: FilterComponent[];
  private nbrRecipes: HTMLParagraphElement;
  private observers: IObserver[] = [];

  constructor(filtersState: FiltersState, recipesState: RecipesState) {
    this.filtersState = filtersState;
    this.recipesState = recipesState;
    this.btnArray = ["ingredients", "appliances", "ustensils"];
    this.selectedSection = document.createElement("div");
    this.filterComponents = this.btnArray.map((option) => {
      const filterComponent = new FilterComponent(this.filtersState, option);
      this.addObserver(filterComponent);
      return filterComponent;
    });

    this.nbrRecipes = document.createElement("p");
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

      filtersDisplayFirstLayer.appendChild(btnsCompartement);

      //Nbr total recipes
      const totalRecipes = this.recipesState.getRecipesDisplayed().length;

      this.nbrRecipes.textContent = `${totalRecipes} recettes`;
      this.nbrRecipes.classList.add("nbr-recipes");
      filtersDisplayFirstLayer.appendChild(this.nbrRecipes);
      filtersSection!.appendChild(filtersDisplayFirstLayer);
    }

    /////////////////second layer Filters display (display the selected elements)

    const filtersDisplaySecondLayer = this.selectedSection;
    filtersDisplaySecondLayer.classList.add("element-selected-container");

    this.getSelectedFiltersSection();

    if (filtersSection) {
      filtersSection.appendChild(filtersDisplaySecondLayer);
    }

    return filtersSection!;
  }

  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    this.observers.forEach((observer) => {
      observer.update();
    });
  }

  private updateRecipesCount() {
    this.nbrRecipes.textContent = "";
    const totalRecipes = this.recipesState.getRecipesDisplayed().length;
    this.nbrRecipes.textContent = `${totalRecipes} recettes`;
  }

  private getSelectedFiltersSection(): HTMLDivElement {
    const filtersDisplaySecondLayer = this.selectedSection;
    filtersDisplaySecondLayer.innerHTML = "";
    const selectedFilters = this.filtersState.getFilters().selectedFilters;

    const selectedFiltersAsString = Object.values(selectedFilters).flatMap(
      (filtersSet) => Array.from(filtersSet as Set<string>)
    );

    selectedFiltersAsString.forEach((element) => {
      const filterBox = this.createFilterBox(element);

      filtersDisplaySecondLayer.appendChild(filterBox);
    });

    return filtersDisplaySecondLayer;
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

  update() {
    this.updateRecipesCount();
    this.getSelectedFiltersSection();
    this.notifyObservers();
  }
}
