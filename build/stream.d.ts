import { Maybe } from "./types";
export declare class Stream<T> {
    static merge<T>(...streams: Array<Stream<T>>): Stream<T>;
    private _current;
    private _subscriptions;
    constructor(initial?: T);
    readonly current: Maybe<T>;
    listen(handler: StreamListenerHandler<T>, autoStart?: boolean): Stream.ISubscription;
    push(value: T): void;
}
export declare namespace Stream {
    interface ISubscription {
        start(): boolean;
        stop(): boolean;
    }
}
export declare type StreamListenerHandler<T> = (data: T) => void;
