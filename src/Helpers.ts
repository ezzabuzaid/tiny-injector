import { Injectable } from "./Injectable";
import { ServiceLifetime } from "./ServiceLifetime";
import { ServiceType } from "./Types";

interface Options {
    serviceType?: ServiceType<any>;
}

/**
 * A class level decorator used to registere the class as Singleton
 */
export function Singleton(options?: Options): ClassDecorator {
    return Injectable({
        lifetime: ServiceLifetime.Singleton,
        serviceType: options?.serviceType
    });
}

/**
 * A class level decorator used to registere the class as Transient
 */
export function Transient(options?: Options): ClassDecorator {
    return Injectable({
        lifetime: ServiceLifetime.Transient,
        serviceType: options?.serviceType
    });
}

/**
 * A class level decorator used to registere the class as Scoped
 */
export function Scoped(options?: Options): ClassDecorator {
    return Injectable({
        lifetime: ServiceLifetime.Scoped,
        serviceType: options?.serviceType
    });
}
