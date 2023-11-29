//IMPORTS
import { ISubject, IObserver } from "./observer-interfaces";
import { displayRecipes } from "../main";
import { Recipe } from "../models/recipe";

//CLASS

class Page implements IObserver, ISubject {
  private observers: IObserver[] = [];
  private recipesDisplayed: Recipe[] = [];

  //as Observer -> récupère les recette filtrées de Filtres
  update(filtredRecipes: Recipe[]) {
    this.getRecipes(filtredRecipes);
  }

  //as Subject -> (met à jour les recettes + nbr recettes) envoi les recettes
  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    this.observers.forEach((observer) =>
      observer.update(this.recipesDisplayed)
    );
  }

  getRecipes(recipes: Recipe[]): void {
    displayRecipes(recipes);
  }
}

class Filters implements IObserver, ISubject {
  private observers: IObserver[] = [];
  private filterElements: [] = [];

  //as Observer -> met à jour les recettes filtrées en fonction de chaque FiltreElement
  update(selectedFilter: any): void {
    this.filterElements.push(selectedFilter);
  }

  //as Subject -> Envoi un nouveau tableau de recettes filtrées
  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    this.observers.forEach((observer) => observer.update(this.filterElements));
  }
  setFiltredRecipes() {
    this.notifyObservers();
  }
}

class FilterElement implements IObserver, ISubject {
  private observers: IObserver[] = [];
  private selectedFilters: HTMLElement[] = [];

  constructor() {
    const filterElements = document.querySelectorAll(".filtered-element");

    filterElements.forEach((element) => {
      element.addEventListener("click", () => this.displayFilters(element));
    });
  }

  //as observer -> met à jours ses tags en fonctions des recettes filtrées
  update(filtersByRecipes: any): void {
    this.displayFilters(filtersByRecipes);
  }

  //as Subject -> envoi les tags selectionnées à Filtres
  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    this.observers.forEach((observer) => observer.update(this.selectedFilters));
  }

  displayFilters(element: HTMLElement): void {
    // Check if the element is already in the selectedFilters array
    const index = this.selectedFilters.indexOf(element);

    if (index === -1) {
      // If not present, add it to the array

      this.selectedFilters.push(element);
      element.classList.add("selected-filtered-element");
    } else {
      // If already present, remove it from the array

      this.selectedFilters.splice(index, 1);
      element.classList.remove("selected-filtered-element");
    }
    this.notifyObservers();
  }
}
