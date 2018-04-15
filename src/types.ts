export type Maybe<T> = T | undefined;
export type Nullable<T> = T | null;
export type Either<T, U> = (T & {success: true}) | (U & {success: false});
