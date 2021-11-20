import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ClassType, ServiceType, TypeOf } from "../Types";

export abstract class TryAddTransientExtensions {

    /**
     * Add a transient service of the type specified in serviceType with a factory specified in implementationFactory if the service type hasn't already been registered.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored.
     *
     * @param serviceType - The type of the service to add.
     * @param implementationFactory - the factory that creates the service.
     */
    abstract TryAddTransient<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    /**
     * Add a transient service of the injection token with a factory specified in implementationFactory if the service type hasn't already been registered.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored.
     *
     * @param injectionToken The token to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    abstract TryAddTransient<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    /**
     * Add a transient service of the type specified in serviceType with an implementation of the type specified in implementationType if the service type hasn't already been registered.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored
     * 
     * @param serviceType - The type of the service to add.
     * @param implementationType - The type of the implementation to use.
     */
    abstract TryAddTransient<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    /**
     * Add a transient service of the type specified in serviceType if the service type hasn't already been registered.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored
     *
     * @param serviceType - The type of the service to add.
     */
    abstract TryAddTransient<T extends ClassType<any>>(serviceType: T): void;
}
