import { Context } from "../Context";
import { ClassType, ServiceType, TypeOf } from "../Types";

export abstract class AppendScopedExtensions {

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
    abstract AppendScoped<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
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
    abstract AppendScoped<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: T): void;
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
    abstract AppendScoped<T extends ClassType<any>>(serviceType: T): void;
}