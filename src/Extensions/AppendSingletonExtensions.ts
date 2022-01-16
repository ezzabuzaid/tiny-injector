import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ClassType, ServiceType, TypeOf } from "../Types";


export abstract class AppendSingletonExtensions {

    /**
     * Append a singleton service of the type specified in serviceType with a factory specified in implementationFactory.
     *
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddSingleton will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * "@Inject(Interceptor) interceptors: Interceptor[]""
     *
     * @see AddSingleton
     *
     * @param serviceType The type of the service to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    abstract AppendSingleton<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    /**
     * Append a singleton service of the injection token with a factory specified in implementationFactory
     *
     * @description
     * This method introduced because AddSingleton will prevent the same injection token from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(TOKEN) interceptors: TokenInterface[]
     *
     * @param injectionToken The token to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    abstract AppendSingleton<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    /**
     * Append a singleton service of the type specified in serviceType with an implementation of the type specified in implementationType.
     *
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddSingleton will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     *
     * @see AddSingleton
     *
     * @param serviceType The type of the service to add.
     * @param implementationType The type of the implementation to use.
     */
    abstract AppendSingleton<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: T): void;
    /**
     * Append a singleton service of the type specified in serviceType.
     *
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddSingleton will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     *
     * @see AddSingleton
     *
     * @param serviceType The type of the service to add.
     *
     */
    abstract AppendSingleton<T extends ClassType<any>>(serviceType: T): void;
}
