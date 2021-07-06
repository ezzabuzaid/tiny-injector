import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ClassType, ServiceType, TypeOf } from "../Types";

export abstract class AddScopedExtensions {

    /**
     * Add a scoped service of the type specified in serviceType with a factory specified in implementationFactory.
     * 
     * @description
     * Scoped services are created once per context.
     *
     * @see {CreateScope}
     * @see {Create}
     *
     * @param serviceType The type of the service to add.
     * @param implementationFactory the factory that creates the service.
     */
    abstract AddScoped<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    /**
     * Add a scoped service of the injection token with a factory specified in implementationFactory.
     *
     * @description
     * Scoped services are created once per context.
     *
     * @see {CreateScope}
     * @see {Create}
     * 
     * @param injectionToken The token to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    abstract AddScoped<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    /**
     * Add a scoped service of the type specified in serviceType with an implementation of the type specified in implementationType.
     *
     * @description
     * Scoped services are created once per context.
     *
     * @see {CreateScope}
     * @see {Create}
     * 
     * @param serviceType The type of the service to add.
     * @param implementationType The type of the implementation to use.
     */
    abstract AddScoped<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    /**
     * Add a scoped service of the type specified in serviceType.
     * 
     * @description
     * Scoped services are created once per context.
     *
     * @see {CreateScope}
     * @see {Create}
     *
     * @param serviceType The type of the service to add.
     */
    abstract AddScoped<T extends ClassType<any>>(serviceType: T): void;
}