//IMPORTS
import { ISubject, IObserver } from "./observer-interfaces";
import { displayRecipes } from "../main";
import { Recipe } from "../models/recipe";

//CLASS

class Page implements IObserver, ISubject {
  private observers: IObserver[] = [];
  private recipesDisplayed: Recipe[] = [];

  //as Observer
  update(filtredRecipes: Recipe[]) {
    this.getRecipes(filtredRecipes);
  }

  //as Subject
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

  //as Observer
  // Update method to receive changes from the filter element
  update(selectedFilter: any): void {
    this.filterElements.push(selectedFilter);
  }

  //as Subject
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

  //as observer
  update(filtersByRecipes: any): void {
    this.displayFilters(filtersByRecipes);
  }

  //as Subject
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
