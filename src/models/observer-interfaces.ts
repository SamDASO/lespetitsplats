export interface IObserver {
  update(data: any): void;
}

export interface IObservable {
  addObserver(observers: IObserver): void;
  notifyObservers(): void;
}
