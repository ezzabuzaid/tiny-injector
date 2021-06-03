import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ClassType, Type, TypeOf } from "../Types";



export abstract class AddTransientExtensions {

    /**
     * Add a transient service of the type specified in serviceType with a factory specified in implementationFactory.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored.
     *
     * @param serviceType - The type of the service to add.
     * @param implementationFactory - the factory that creates the service.
     */
    abstract AddTransient<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    /**
     * Add a transient service of the injection token with a factory specified in implementationFactory.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored.
     *
     * @param injectionToken The token to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    abstract AddTransient<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    /**
     * Add a transient service of the type specified in serviceType with an implementation of the type specified in implementationType.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored
     * 
     * @param serviceType - The type of the service to add.
     * @param implementationType - The type of the implementation to use.
     */
    abstract AddTransient<T extends Type<any>, I extends T>(serviceType: T, implementationType: I): void;
    /**
     * Add a transient service of the type specified in serviceType.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored
     *
     * @param serviceType - The type of the service to add.
     */
    abstract AddTransient<T extends ClassType<I>, I>(serviceType: T): void;
}
