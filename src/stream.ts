import {Maybe} from "./types";

export class Stream<T> {
  public static merge<T>(...streams: Array<Stream<T>>): Stream<T> {
    const mergedStream = new Stream<T>();
    const mergedStreamHandler = (value: T) => mergedStream.push(value);

    streams.forEach(stream => {
      stream.listen(mergedStreamHandler).start();
    });

    return mergedStream;
  }

  private _current: Maybe<T>;
  private _subscriptions: Array<StreamListenerHandler<T>>;

  constructor(initial?: T) {
    this._current = initial;
    this._subscriptions = [];
  }

  public get current(): Maybe<T> {
    return this._current;
  }

  public listen(handler: StreamListenerHandler<T>, autoStart: boolean = false): Stream.ISubscription {
    let isSubscribed = false;

    const subscription = {
      start: () => {
        if (!isSubscribed) {
          isSubscribed = true;
          this._subscriptions.push(handler);

          return true;
        }

        return false;
      },
      stop: () => {
        if (isSubscribed) {
          isSubscribed = false;
          const index = this._subscriptions.indexOf(handler);
          if (index !== -1) {
            this._subscriptions.splice(index, 1);
          }

          return true;
        }

        return false;
      },
    };

    autoStart && subscription.start();

    return subscription;
  }

  public push(value: T): void {
    this._current = value;
    this._subscriptions.forEach(subscription => subscription(value));
  }
}

export namespace Stream {
  export interface ISubscription {
    start(): boolean;
    stop(): boolean;
  }
}

export type StreamListenerHandler<T> = (data: T) => void;
