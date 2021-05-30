import { AbstractServiceCollection } from "../AbstractServiceCollection";
import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ServiceLifetime } from "../ServiceLifetime";
import { ClassType, Type, TypeOf } from "../Types";
import { GetRequiredService } from "./LocateExtensions";

/**
 * Add a singleton service of the type specified in serviceType with a factory specified in implementationFactory.
 * 
 * @description
 * Singleton services are created The first time they're requested.
 * the same instance will be resolved for each subsequent request.
 *
 * @param serviceType The type of the service to add.
 * @param implementationFactory the factory that creates the service.
 * 
 */
export function AddSingleton<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
/**
 * Add a singleton service of the injection token with a factory specified in implementationFactory.
 *
 * @description
 * Singleton services are created The first time they're requested.
 * the same result will be returned for each subsequent request.
 *
 * @param injectionToken The token to add.
 * @param implementationFactory the factory that creates the service.
 *
 */
export function AddSingleton<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
/**
 * Add a singleton service of the type specified in serviceType with an implementation of the type specified in implementationType.
 * 
 * @description
 * Singleton services are created The first time they're requested.
 * the same instance will be resolved for each subsequent request.
 * 
 * @param serviceType The type of the service to add.
 * @param implementationType The type of the implementation to use.
 */
export function AddSingleton<T extends Type<any>, I extends (T & ClassType<any>)>(serviceType: T, implementationType: I): void;
/**
 * Add a singleton service of the type specified in serviceType.
 *
 * @description
 * Singleton services are created The first time they're requested.
 * the same instance will be resolved for each subsequent request.
 *
 * @param serviceType The type of the service to add.
 *
 */
export function AddSingleton<T extends ClassType<any>>(serviceType: T): void;

export function AddSingleton(serviceType: any, implementation?: any) {
    GetRequiredService(AbstractServiceCollection).AddService(serviceType, implementation, ServiceLifetime.Singleton);
}