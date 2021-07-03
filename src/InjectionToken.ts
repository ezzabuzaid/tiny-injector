import RootServiceCollection from "./RootServiceCollection";
import { AbstractServiceCollection } from "./AbstractServiceCollection";
import { ArgumentException } from "./Exceptions";
import { ServiceLifetime } from "./ServiceLifetime";
import { ImplementationFactory } from "./Types";
import { isArrowFn, isNullOrUndefined, notNullOrUndefined } from "./Utils";
export type InjectionTokenGenericParam<C extends InjectionToken<any>> = C extends InjectionToken<infer T> ? T : unknown;

type FactoryType<T extends
    (new (...args: any) => any)
    |
    string
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
    implementationFactory: ImplementationFactory<FactoryType<T>>;

    provideIn?: 'root' | AbstractServiceCollection;
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
    #InjectionTokenDifferentiator = null;
    constructor(_name: string, options?: Options<T>) {
        class serviceType extends InjectionToken<T> { };

        if (typeof _name !== 'string' || _name.trim() === '') {
            throw new ArgumentException('InjectionToken name must be valid non string', 'name')
        }

        if (notNullOrUndefined(options) && !isArrowFn(options.implementationFactory)) {
            throw new ArgumentException('InjectionToken implementationFactory can only be arrow function', 'options.implementationFactory')
        }

        if (notNullOrUndefined(options) && isNullOrUndefined(ServiceLifetime[options.lifetime])) {
            throw new ArgumentException('InjectionToken lifetime is unknown', 'options.lifetime')
        }

        Object.defineProperty(serviceType, 'name', { value: _name });

        if (notNullOrUndefined(options)) {
            options.provideIn ??= 'root';
            const serviceCollection = options.provideIn === 'root' ? RootServiceCollection : options.provideIn;
            switch (options.lifetime) {
                case ServiceLifetime.Scoped:
                    serviceCollection.AddScoped(serviceType, options.implementationFactory as any)
                    break;
                case ServiceLifetime.Singleton:
                    serviceCollection.AddSingleton(serviceType, options.implementationFactory as any)
                    break;
                case ServiceLifetime.Transient:
                    serviceCollection.AddTransient(serviceType, options.implementationFactory as any)
                    break;
                default:
                    throw new ArgumentException('Injectable lifetime is unknown', 'options.lifetime')
            }
        }
        return serviceType as any;
    }
}
