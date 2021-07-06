import { ServiceType } from "./Types";
import { Injectable } from "./Injectable";
import { ServiceLifetime } from "./ServiceLifetime";

interface Options {
    serviceType?: ServiceType<any>;
}

/**
 * A class level decorator used to add the class as Singleton
 */
export function Singleton(options?: Options): ClassDecorator {
    return Injectable({
        lifetime: ServiceLifetime.Singleton,
        serviceType: options?.serviceType
    });
}

/**
 * A class level decorator used to add the class as Transient
 */
export function Transient(options?: Options): ClassDecorator {
    return Injectable({
        lifetime: ServiceLifetime.Transient,
        serviceType: options?.serviceType
    });
}

/**
 * A class level decorator used to add the class as Scoped
 */
export function Scoped(options?: Options): ClassDecorator {
    return Injectable({
        lifetime: ServiceLifetime.Scoped,
        serviceType: options?.serviceType
    });
}
