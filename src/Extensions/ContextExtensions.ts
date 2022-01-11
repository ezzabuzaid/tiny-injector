import { Context } from "../Context";
export abstract class ContextExtensions {

    /**
     * Create a context and immediately destroy it after computation is done.
     *
     * @returns return value of `computation`
     *
     * @param computation
     */
    abstract CreateScope<T>(computation: (context: Context) => Promise<T> | T): Promise<T>;

    /**
     * Create context
     */
    abstract Create(): Context;

    abstract Destroy(context: Context): void;


}
