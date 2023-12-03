import { IObservable, IObserver } from "../models/observer-interfaces.ts";
import { Filters } from "../models/filters.ts";
import { FiltersState } from "./filtersState.ts";

export class FilterState implements IObservable, IObserver {
  private observers: IObserver[] = [];
  private filtersDisplayed: Filters;
  private selectedFilter: Filters;
  private filtersStateInstance: FiltersState;

  constructor(displayedFilters: Filters, observers: IObserver[]) {
    this.observers = observers;
    this.filtersDisplayed = displayedFilters;
    this.selectedFilter = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
    };
    this.filtersStateInstance = new FiltersState();
  }

  //As Observer
  //obtain filters to display by FiltersState
  update(filters: Filters) {
    filters = this.filtersDisplayed;
  }

  //As observable

  addObserver(observer: IObserver): void {
    this.observers.push(observer);
  }

  notifyObservers(): void {
    this.observers.forEach((observer) => observer.update(this.selectedFilter));
  }

  //filters management

  getFilterToMenuList(): Filters {
    this.filtersDisplayed;
    return this.filtersDisplayed;
  }

  private handleFilterClick(option: Element) {
    const filterValue = option.textContent?.trim();
    if (filterValue) {
      this.filtersStateInstance.toggleSelectedFilters(filterValue);
    }
  }

  getFilterSelected(): void {
    const filtersOptions = document.querySelectorAll(".filter-option");

    filtersOptions.forEach((option: Element) => {
      option.addEventListener("click", () => {
        this.handleFilterClick(option);
      });
    });

    this.notifyObservers(); // Notify the filter selected to FiltersState class
  }
}
