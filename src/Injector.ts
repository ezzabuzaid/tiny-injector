import { AbstractServiceCollection } from "./AbstractServiceCollection";
import { Context } from "./Context";
import { AddScopedExtensions, AddSingletonExtensions, AddTransientExtensions, AppendScopedExtensions, AppendSingletonExtensions, AppendTransientExtensions, ReplaceScopedExtensions, ReplaceSingletonExtensions, ReplaceTransientExtensions, ServiceProviderServiceExtensions } from "./Extensions";
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
    ServiceProviderServiceExtensions;

type Of = {
    Of(serviceCollection: AbstractServiceCollection): Extensions;
}

class _Injector implements Extensions {
    private serviceProvider = this.serviceCollection.BuildServiceProvider();
    constructor(
        private serviceCollection: AbstractServiceCollection
    ) { }

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
