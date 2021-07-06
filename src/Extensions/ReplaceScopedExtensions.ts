import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ClassType, ServiceType, TypeOf } from "../Types";


export abstract class ReplaceScopedExtensions {

    /**
     * Replace a scoped service of the type specified in serviceType with an implementation of the type specified in implementationType.
     *
     * @description
     * Replace removes previous registerd service.
     *
     * @throws {ServiceNotFoundException} in case serviceType is not registered before.
     *
     * @param serviceType The type of the service to replace.
     * @param implementationType The type of the implementation to use.
     */
    abstract ReplaceScoped<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;

    /**
     * Replace scoped service of the type specified in serviceType with a factory specified in implementationFactory.
     *
     * @description
     * Replace removes previous registerd service.
     *
     * @throws {ServiceNotFoundException} in case serviceType is not registered before.
     *
     * @param serviceType The type of the service to replace.
     * @param implementationFactory the factory that creates the service.
     * 
     */
    abstract ReplaceScoped<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;

    /**
     * Replace a scoped service of the injection token with a factory specified in implementationFactory.
     *
     * @description
     * Replace removes previous registerd service.
     *
     * @throws {ServiceNotFoundException} in case serviceType is not registered before.
     *
     * @param injectionToken The token to replace.
     * @param implementationFactory the factory that creates the service.
     *
     */
    abstract ReplaceScoped<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;

    /**
     * Replace a scoped service of the type specified in serviceType.
     * 
     * @description
     * Replace removes previous registerd service.
     * 
     * @throws {ServiceNotFoundException} in case serviceType is not registered before.
     *
     * @param serviceType The type of the service to replace.
     *
     */
    abstract ReplaceScoped<T extends ClassType<any>>(serviceType: T): void;

}