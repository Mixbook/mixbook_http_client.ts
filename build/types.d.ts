export declare type Maybe<T> = T | undefined;
export declare type Nullable<T> = T | null;
export declare type Either<T, U> = (T & {
    success: true;
}) | (U & {
    success: false;
});
