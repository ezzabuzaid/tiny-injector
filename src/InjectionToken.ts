import { Context, Injector, ServiceLifetime } from ".";
import { Type } from "./Utils";

type FactoryType<T extends
    (new (...args: any) => any)
    |
    String
    |
    Array<T>
    |
    Object
    > = T extends new (...args: any) => infer R ? R : T;
interface Options<T> {
    /**
     * Lifetime of the service
     */
    lifetime: ServiceLifetime;

    /**
     * The factory that creates the service.
     */
    implementationFactory: (context: Context) => FactoryType<T>;
}

/**
 * Injection tokens allows injection of values that don't have a runtime representation.
 * 
 * Use an InjectionToken whenever the type you are injecting is not reified (does not have a runtime representation) such as when injecting an interface, callable type, array or parameterized type.
 * 
 * InjectionToken is parameterized on T which is the type of object which will be returned by the Injector .
 * 
 * @link https://github.com/angular/angular/blob/master/packages/core/src/di/injection_token.ts
 */
export class InjectionToken<T> {
    constructor(public _name: string, options?: Options<T>) {
        class serviceType extends InjectionToken<T> { };
        Object.defineProperty(serviceType, 'name', { value: _name });
        if (options && ServiceLifetime[options.lifetime]) {
            Injector.instance.AddService(serviceType, options.implementationFactory, options.lifetime)
        }
        return serviceType as any;
    }
}
