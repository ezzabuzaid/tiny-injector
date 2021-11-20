import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ClassType, ServiceType, TypeOf } from "../Types";


export abstract class TryAddSingletonExtensions {

    /**
     * Add a singleton service of the type specified in serviceType with a factory specified in implementationFactory if the service type hasn't already been registered.
     * 
     * @description
     * Singleton services are created The first time they're requested.
     * the same instance will be resolved for each subsequent request.
     *
     * @param serviceType The type of the service to add.
     * @param implementationFactory the factory that creates the service.
     * 
     */
    abstract TryAddSingleton<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    /**
     * Add a singleton service of the injection token with a factory specified in implementationFactory if the service type hasn't already been registered.
     *
     * @description
     * Singleton services are created The first time they're requested.
     * the same result will be returned for each subsequent request.
     *
     * @param injectionToken The token to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    abstract TryAddSingleton<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    /**
     * Add a singleton service of the type specified in serviceType with an implementation of the type specified in implementationType if the service type hasn't already been registered.
     * 
     * @description
     * Singleton services are created The first time they're requested.
     * the same instance will be resolved for each subsequent request.
     * 
     * @param serviceType The type of the service to add.
     * @param implementationType The type of the implementation to use.
     */
    abstract TryAddSingleton<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    /**
     * Add a singleton service of the type specified in serviceType if the service type hasn't already been registered.
     *
     * @description
     * Singleton services are created The first time they're requested.
     * the same instance will be resolved for each subsequent request.
     *
     * @param serviceType The type of the service to add.
     *
     */
    abstract TryAddSingleton<T extends ClassType<any>>(serviceType: T): void;

}