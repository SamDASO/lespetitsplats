export interface IObserver {
  update(data: any, isPageObserver?: boolean): void;
}

export interface IObservable {
  addObserver(observers: IObserver, isPageObserver?: boolean): void;
  notifyObservers(isPageObserver?: boolean): void;
}
