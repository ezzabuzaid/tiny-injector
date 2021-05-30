import { AbstractServiceCollection } from "../AbstractServiceCollection";
import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ServiceLifetime } from "../ServiceLifetime";
import { ClassType, Type, TypeOf } from "../Types";
import { Locate } from "./LocateExtensions";

/**
 * Add a transient service of the type specified in serviceType with a factory specified in implementationFactory.
 *
 * @description
 * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored.
 *
 * @param serviceType - The type of the service to add.
 * @param implementationFactory - the factory that creates the service.
 */
export function AddTransient<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
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
export function AddTransient<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
/**
 * Add a transient service of the type specified in serviceType with an implementation of the type specified in implementationType.
 *
 * @description
 * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored
 * 
 * @param serviceType - The type of the service to add.
 * @param implementationType - The type of the implementation to use.
 */
export function AddTransient<T extends Type<any>, I extends T>(serviceType: T, implementationType: I): void;
/**
 * Add a transient service of the type specified in serviceType.
 *
 * @description
 * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored
 *
 * @param serviceType - The type of the service to add.
 */
export function AddTransient<T extends ClassType<I>, I>(serviceType: T): void;
export function AddTransient(serviceType: any, implementation?: any) {
    Locate(AbstractServiceCollection).AddService(serviceType, implementation, ServiceLifetime.Transient);
}