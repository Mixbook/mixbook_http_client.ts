import {Maybe} from "./types";

export namespace FunctionUtils {
  export type TReturns<T> = (...args: any[]) => T;

  export function throttle<TFunc extends TReturns<void>>(fn: TFunc, threshold: number): TFunc {
    let timer: Maybe<number>;
    let args: Maybe<IArguments>;
    let defered = false;

    function throttleFn(this: TFunc): void {
      args = arguments;

      if (!timer) {
        fn.apply(this, args);
        timer = window.setTimeout(() => {
          timer = 0;
          if (defered) {
            defered = false;
            fn.apply(this, args);
          }
        }, threshold);
      } else {
        defered = true;
      }
    }

    return throttleFn as TFunc;
  }
}
