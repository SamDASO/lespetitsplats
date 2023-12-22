export interface IObserver {
  update(): void;
}

export interface IObservable {
  addObserver(observers: IObserver): void;
  notifyObservers(): void;
}
