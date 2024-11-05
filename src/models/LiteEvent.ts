// Credits to: https://stackoverflow.com/a/14657922/11010139, https://gist.github.com/JasonKleban/50cee44960c225ac1993c922563aa540

type THandler<T> = (data: T) => void;

interface ILiteEvent<T> {
  on(handler: THandler<T>): void;
  off(handler: THandler<T>): void;
}

export class LiteEvent<T> implements ILiteEvent<T> {
  private handlers = Array<THandler<T>>();

  public on(handler: THandler<T>): void {
    this.handlers.push(handler);
  }

  public off(handler: THandler<T>): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  public trigger(data: T) {
    this.handlers.slice(0).forEach((h) => h(data));
  }
}
