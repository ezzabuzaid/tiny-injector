import { AbstractServiceCollection, LocateOptions } from "./AbstractServiceCollection";
import { Context } from "./Context";
import { AddScopedExtensions, AddSingletonExtensions, AddTransientExtensions, AppendScopedExtensions, AppendSingletonExtensions, AppendTransientExtensions, CreateExtensions, DestroyServiceExtensions, GetServiceExtensions, ReplaceScopedExtensions, ReplaceSingletonExtensions, ReplaceTransientExtensions } from "./Extensions";
import { InjectionToken } from "./InjectionToken";
import RootServiceCollection from "./RootServiceCollection";
import { Type } from "./Types";


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
    CreateExtensions &
    GetServiceExtensions &
    DestroyServiceExtensions;

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

    Remove(serviceType: Type<any>): void {
        this.serviceCollection.Remove(serviceType);
    }

    GetRequiredService(serviceType: any, context?: any) {
        return this.serviceProvider.GetRequiredService(serviceType, context);
    }

    GetService(serviceTypeOrOptions: Type<any> | InjectionToken<any> | LocateOptions, context?: Context) {
        return this.serviceProvider.GetService(serviceTypeOrOptions, context);
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

    CreateScope(computation: (context: Context) => void | Promise<void>): Promise<void> {
        return this.serviceProvider.CreateScope(computation);
    }

    Create(): Context {
        return this.serviceProvider.Create()
    }

    Destroy(context: Context): void {
        return this.serviceProvider.Destroy(context);
    }

}
export const Injector: Extensions & Of = new _Injector(RootServiceCollection) as any;


Injector.Of = (serviceCollection: AbstractServiceCollection) => {
    return new _Injector(serviceCollection);
}
