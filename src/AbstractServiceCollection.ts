import { InjectionToken, InjectionTokenGenericParam } from "./InjectionToken";
import { ClassType, ImplementationFactory, Type, TypeOf } from "./Types";
import { ServiceLifetime } from "./ServiceLifetime";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { Context } from "./Context";
import { AddScopedExtensions, AddSingletonExtensions, AddTransientExtensions, AppendScopedExtensions, AppendSingletonExtensions, AppendTransientExtensions } from "Extensions";
import { ServiceProvider } from "./ServiceProvider";

export abstract class AbstractServiceCollection implements
    AddScopedExtensions,
    AddSingletonExtensions,
    AddTransientExtensions,
    AppendScopedExtensions,
    AppendSingletonExtensions,
    AppendTransientExtensions {
    public abstract AppendTransient<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AppendTransient<T, I extends T>(serviceType: T, implementationType: T): void;
    public abstract AppendTransient<T extends ClassType<any>>(serviceType: T): void;
    public abstract AppendSingleton<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AppendSingleton<T, I extends T>(serviceType: T, implementationType: T): void;
    public abstract AppendSingleton<T extends ClassType<any>>(serviceType: T): void;
    public abstract AppendScoped<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AppendScoped<T, I extends T>(serviceType: T, implementationType: T): void;
    public abstract AppendScoped<T extends ClassType<any>>(serviceType: T): void;
    public abstract AddTransient<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AddTransient<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract AddTransient<T extends Type<any>, I extends T>(serviceType: T, implementationType: I): void;
    public abstract AddTransient<T extends ClassType<I>, I>(serviceType: T): void;
    public abstract AddSingleton<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AddSingleton<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract AddSingleton<T extends Type<any>, I extends T & ClassType<any>>(serviceType: T, implementationType: I): void;
    public abstract AddSingleton<T extends ClassType<any>>(serviceType: T): void;
    public abstract AddScoped<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AddScoped<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract AddScoped<T extends Type<any>, I extends T>(serviceType: T, implementationType: I): void;
    public abstract AddScoped<T extends ClassType<I>, I>(serviceType: T): void;
    public abstract BuildServiceProvider(): ServiceProvider;
    public abstract GetServiceDescriptors<T>(serviceType: Type<T>): ServiceDescriptor[];

    protected abstract HasService(serviceType: Type<any>): boolean;
    public abstract Remove(serviceType: Type<any>): void;
    protected abstract AddService<T extends Type<any>>(serviceType: T, implementationFactory: ImplementationFactory<TypeOf<T>>, lifetime: ServiceLifetime): void;
    protected abstract AddService<T extends Type<any>>(serviceType: T, implementation: ClassType<TypeOf<T>>, lifetime: ServiceLifetime): void;
    protected abstract TryAddService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void;
    protected abstract AppendService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void;
    protected abstract ReplaceService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void;
}

export type LocateOptions = { serviceType: Type<any>, multiple: boolean, context?: Context };
