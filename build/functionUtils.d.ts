export declare namespace FunctionUtils {
    type TReturns<T> = (...args: any[]) => T;
    function throttle<TFunc extends TReturns<void>>(fn: TFunc, threshold: number): TFunc;
}
