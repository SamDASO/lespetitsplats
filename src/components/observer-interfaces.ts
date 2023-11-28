export interface IObserver {
  update(data: any): void;
}

export interface ISubject {
  addObserver(observer: IObserver): void;
  notifyObservers(): void;
}
