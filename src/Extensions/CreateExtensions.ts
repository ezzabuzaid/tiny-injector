import { Type } from "Types";
import { Context } from "../Context";

export abstract class CreateExtensions {

    /**
     * Create a context and immediately destroy it after computation is done.
     *
     * @param computation
     */
    abstract CreateScope(computation: (context: Context) => Promise<void> | void): Promise<void>;

    /**
     * Create context
     */
    abstract Create(): Context;

    abstract Destroy(context: Context): void;


}