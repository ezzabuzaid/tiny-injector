import { AbstractServiceCollection } from "../AbstractServiceCollection";
import { Context } from "../Context";
import { ServiceLifetime } from "../ServiceLifetime";
import { ClassType, Type, TypeOf } from "../Types";
import { GetRequiredService } from "./LocateExtensions";

/**
 * Appends a singleton service of the type specified in serviceType with a factory specified in implementationFactory.
 * 
 * @description
 * Use this method when you want to have different implementations for the same serviceType
 *
 * This method introduced because AddScoped will prevent the same serviceType from being added twice
 *
 * You'll need to use {@Inject} decorator to resolve array of implementations.
 * @Inject(Interceptor) interceptors: Interceptor[]
 *
 * @see AddScoped
 *
 * @param serviceType The type of the service to add.
 * @param implementationFactory the factory that creates the service.
 * 
 */
export function AppendScoped<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
/**
 * Appends a Scoped service of the type specified in serviceType with an implementation of the type specified in implementationType.
 * 
 * @description
 * Use this method when you want to have different implementations for the same serviceType
 * 
 * This method introduced because AddScoped will prevent the same serviceType from being added twice
 * 
 * You'll need to use {@Inject} decorator to resolve array of implementations.
 * @Inject(Interceptor) interceptors: Interceptor[]
 * 
 * @see AddScoped
 * 
 * @param serviceType The type of the service to add.
 * @param implementationType The type of the implementation to use.
 */
export function AppendScoped<T, I extends T>(serviceType: T, implementationType: T): void;
/**
 * Add a singleton service of the type specified in serviceType.
 *
 * @description
 * Use this method when you want to have different implementations for the same serviceType
 *
 * This method introduced because AddScoped will prevent the same serviceType from being added twice
 *
 * You'll need to use {@Inject} decorator to resolve array of implementations.
 * @Inject(Interceptor) interceptors: Interceptor[]
 *
 * @see AddScoped
 *
 * @param serviceType The type of the service to add.
 *
 */
export function AppendScoped<T extends ClassType<any>>(serviceType: T): void;
export function AppendScoped(serviceType: any, implementation?: any) {
    GetRequiredService(AbstractServiceCollection).AppendService(serviceType, implementation, ServiceLifetime.Scoped);
}