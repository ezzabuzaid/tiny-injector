import { AbstractServiceCollection } from "./AbstractServiceCollection";
import { Context } from "./Context";
import {
    AddScopedExtensions,
    AddSingletonExtensions,
    AddTransientExtensions,
    AppendScopedExtensions,
    AppendSingletonExtensions,
    AppendTransientExtensions,
    ContextExtensions,
    ReplaceScopedExtensions,
    ReplaceSingletonExtensions,
    ReplaceTransientExtensions,
    ServiceProviderServiceExtensions,
    TryAddScopedExtensions,
    TryAddSingletonExtensions,
    TryAddTransientExtensions
} from "./Extensions";
import RootServiceCollection from "./RootServiceCollection";


type Extensions =
    AddScopedExtensions &
    AddSingletonExtensions &
    AddTransientExtensions &
    AppendScopedExtensions &
    AppendSingletonExtensions &
    AppendTransientExtensions &
    ReplaceSingletonExtensions &
    ReplaceTransientExtensions &
    ReplaceScopedExtensions &
    TryAddScopedExtensions &
    TryAddSingletonExtensions &
    TryAddTransientExtensions &
    ServiceProviderServiceExtensions &
    ContextExtensions

type Of = {
    Of(serviceCollection: AbstractServiceCollection): Extensions;
}

class _Injector implements Extensions {
    private readonly serviceProvider ;
    constructor(
        private serviceCollection: AbstractServiceCollection
    ) {
        this.serviceProvider =this.serviceCollection.BuildServiceProvider()
    }

    ReplaceTransient(serviceType: any, implementationType?: any): void {
        this.serviceCollection.ReplaceTransient(serviceType, implementationType);
    }

    ReplaceScoped(serviceType: any, implementationType?: any): void {
        this.serviceCollection.ReplaceScoped(serviceType, implementationType);
    }

    ReplaceSingleton(serviceType: any, implementationType?: any): void {
        this.serviceCollection.ReplaceSingleton(serviceType, implementationType);
    }

    AppendTransient(serviceType: any, implementation?: any) {
        this.serviceCollection.AppendTransient(serviceType, implementation);
    }

    AppendSingleton(serviceType: any, implementation?: any) {
        this.serviceCollection.AppendSingleton(serviceType, implementation);
    }

    AppendScoped(serviceType: any, implementation?: any) {
        this.serviceCollection.AppendScoped(serviceType, implementation);
    }

    AddScoped(serviceType: any, implementation?: any) {
        this.serviceCollection.AddScoped(serviceType, implementation);
    }

    AddSingleton(serviceType: any, implementation?: any) {
        this.serviceCollection.AddSingleton(serviceType, implementation);
    }

    AddTransient(serviceType: any, implementation?: any) {
        this.serviceCollection.AddTransient(serviceType, implementation);
    }

    TryAddScoped(serviceType: any, implementation?: any) {
        this.serviceCollection.TryAddScoped(serviceType, implementation);
    }

    TryAddSingleton(serviceType: any, implementation?: any) {
        this.serviceCollection.TryAddSingleton(serviceType, implementation);
    }

    TryAddTransient(serviceType: any, implementation?: any) {
        this.serviceCollection.TryAddTransient(serviceType, implementation);
    }

    GetRequiredService<T>(injectionToken: any, context?: any): T {
        return this.serviceProvider.GetRequiredService(injectionToken, context);
    }

    GetService<T>(injectionToken: any, context?: any): T | null {
        return this.serviceProvider.GetService(injectionToken, context);
    }

    GetServices<T>(serviceType: any, context?: any): T[] {
        return this.serviceProvider.GetServices(serviceType, context);
    }

    CreateScope<T>(computation: (context: Context) => T | Promise<T>): Promise<T> {
        return this.serviceProvider.CreateScope(computation);
    }

    Destroy(context: Context): void {
        return this.serviceProvider.Destroy(context);
    }

    Create(): Context {
        return this.serviceProvider.Create();
    }
}
export const Injector: Extensions & Of = new _Injector(RootServiceCollection) as any;


Injector.Of = (serviceCollection: AbstractServiceCollection) => {
    return new _Injector(serviceCollection);
}
