import { Context } from "./Context";
import { AddScopedExtensions, AddSingletonExtensions, AddTransientExtensions, AppendScopedExtensions, AppendSingletonExtensions, AppendTransientExtensions, ReplaceScopedExtensions, ReplaceSingletonExtensions, ReplaceTransientExtensions } from "./Extensions";
import { InjectionToken, InjectionTokenGenericParam } from "./InjectionToken";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceProvider } from "./ServiceProvider";
import { ClassType, ServiceType, TypeOf } from "./Types";

export abstract class AbstractServiceCollection implements
    AddScopedExtensions,
    AddSingletonExtensions,
    AddTransientExtensions,
    AppendScopedExtensions,
    AppendSingletonExtensions,
    AppendTransientExtensions,
    ReplaceSingletonExtensions,
    ReplaceScopedExtensions,
    ReplaceTransientExtensions {

    public abstract AddScoped<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AddScoped<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract AddScoped<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    public abstract AddScoped<T extends ClassType<any>>(serviceType: T): void;

    public abstract AddSingleton<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AddSingleton<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract AddSingleton<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    public abstract AddSingleton<T extends ClassType<any>>(serviceType: T): void;

    public abstract AddTransient<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AddTransient<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract AddTransient<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    public abstract AddTransient<T extends ClassType<any>>(serviceType: T): void;

    public abstract ReplaceSingleton<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract ReplaceSingleton<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract ReplaceSingleton<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    public abstract ReplaceSingleton<T extends ClassType<any>>(serviceType: T): void;

    public abstract ReplaceScoped<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract ReplaceScoped<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract ReplaceScoped<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    public abstract ReplaceScoped<T extends ClassType<any>>(serviceType: T): void;

    public abstract ReplaceTransient<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract ReplaceTransient<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    public abstract ReplaceTransient<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: I): void;
    public abstract ReplaceTransient<T extends ClassType<any>>(serviceType: T): void;

    public abstract AppendTransient<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AppendTransient<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: T): void;
    public abstract AppendTransient<T extends ClassType<any>>(serviceType: T): void;

    public abstract AppendScoped<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AppendScoped<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: T): void;
    public abstract AppendScoped<T extends ClassType<any>>(serviceType: T): void;

    public abstract AppendSingleton<T extends ServiceType<any>>(serviceType: T, implementationFactory: (context: Context) => TypeOf<T>): void;
    public abstract AppendSingleton<T extends ServiceType<any>, I extends ClassType<TypeOf<T>>>(serviceType: T, implementationType: T): void;
    public abstract AppendSingleton<T extends ClassType<any>>(serviceType: T): void;



    public abstract BuildServiceProvider(): ServiceProvider;

    public abstract GetServiceDescriptors<T>(serviceType: ServiceType<T> | InjectionToken<any>): ServiceDescriptor[];

    public abstract Remove(serviceType: ServiceType<any>): void;
}
