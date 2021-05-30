import { InjectionToken } from "./InjectionToken";
import { ClassType, ImplementationFactory, Type, TypeOf } from "./Types";
import { ServiceLifetime } from "./ServiceLifetime";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { Context } from "./Context";

export abstract class AbstractServiceCollection {

    abstract HasService(serviceType: Type<any>): boolean;
    abstract Remove(serviceType: Type<any>): void;
    abstract AddService<T extends Type<any>>(serviceType: T, implementationFactory: ImplementationFactory<TypeOf<T>>, lifetime: ServiceLifetime): void;
    abstract AddService<T extends Type<any>>(serviceType: T, implementation: ClassType<TypeOf<T>>, lifetime: ServiceLifetime): void;
    abstract TryAddService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void;
    abstract AppendService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void;
    abstract ReplaceService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void;

    abstract AddContext(context: Context): void;
    abstract DeleteContext(context: Context): void;
    abstract HasContext(context: Context): boolean;

    abstract getServiceDescriptors<T>(serviceType: Type<T>): ServiceDescriptor[];

}

export type LocateOptions = { serviceType: Type<any>, multiple: boolean, context?: Context };
