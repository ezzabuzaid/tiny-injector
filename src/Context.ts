import { Injector } from './Extensions';
import { InjectionToken } from "./InjectionToken";
import { Type } from "./Types";

export class Context {
    #extras = new Map<string, any>();
    constructor() {
        Object.freeze(this);
        Object.seal(this);
    }

    get<T>(serviceType: Type<T> | InjectionToken<T>): T {
        return Injector.Locate<T>(serviceType, this);
    }

    setExtra(name: string, value: any) {
        this.#extras.set(name, value);
    }

    getExtra<T>(name: string): T {
        return this.#extras.get(name) as T;
    }

}

