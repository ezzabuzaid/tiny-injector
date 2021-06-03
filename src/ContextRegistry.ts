import { Context } from "./Context";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { TypeOf } from "./Types";

export class ContextRegistry {
    #registry = new WeakMap<Context, WeakMap<ServiceDescriptor, TypeOf<any>>>();

    private constructor() { }

    Has(context: Context) {
        return this.#registry.has(context);
    }

    Add(context: Context) {
        this.#registry.set(context, new WeakMap());
    }

    Delete(context: Context) {
        this.#registry.delete(context);
    }

    GetContainer(context: Context) {
        return this.#registry.get(context);
    }

    static GetInstance() {
        return this.instance ?? (this.instance = new ContextRegistry());
    }
    private static instance: ContextRegistry;
}
