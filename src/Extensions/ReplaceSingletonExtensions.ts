import { Context } from "../Context";
import { InjectionToken, InjectionTokenGenericParam } from "../InjectionToken";
import { ClassType, Type, TypeOf } from "../Types";


export abstract class ReplaceSingletonExtensions {
    /**
     * Replace a singleton service of the type specified in serviceType with an implementation of the type specified in implementationType.
     *
     * @description
     * Replace removes previous registerd service.
     *
     * @throws {ServiceNotFoundException} in case serviceType is not registered before.
     *
     * @param serviceType The type of the service to replace.
     * @param implementationType The type of the implementation to use.
     */
    abstract ReplaceSingleton<T extends Type<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;

    /**
     * Replace singleton service of the type specified in serviceType with a factory specified in implementationFactory.
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
    abstract ReplaceSingleton<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;

    /**
     * Replace a singleton service of the injection token with a factory specified in implementationFactory.
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
    abstract ReplaceSingleton<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;

    /**
     * Replace a singleton service of the type specified in serviceType.
     *
     * @description
     * Replace removes previous registerd service.
     *
     * @throws {ServiceNotFoundException} in case serviceType is not registered before.
     *
     * @param serviceType The type of the service to replace.
     *
     */
    abstract ReplaceSingleton<T extends ClassType<any>>(serviceType: T): void;

}