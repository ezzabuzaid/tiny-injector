import { Injector } from "./Injector";
import { InjectionToken, InjectionTokenGenericParam } from "./InjectionToken";
import { ServiceType, TypeOf } from "./Types";

export class Context {
    #extras = new Map<string, any>();
    constructor() {
        Object.freeze(this);
        Object.seal(this);
    }

    get<T extends InjectionToken<any>>(serviceType: T): InjectionTokenGenericParam<T>;
    get<T extends ServiceType<any>>(serviceType: T): TypeOf<T>;
    get<T>(serviceType: any) {
        return Injector.GetRequiredService<T>(serviceType, this);
    }

    setExtra(name: string, value: any) {
        this.#extras.set(name, value);
    }

    getExtra<T>(name: string): T {
        return this.#extras.get(name) as T;
    }

}

