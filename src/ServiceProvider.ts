import { AbstractServiceCollection } from "./AbstractServiceCollection";
import { Context } from "./Context";
import { ContextRegistry } from "./ContextRegistry";
import { ArgumentException, InvalidOperationException, ServiceNotFoundException } from "./Exceptions";
import { ContextExtensions, ServiceProviderServiceExtensions } from "./Extensions";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceLifetime } from "./ServiceLifetime";
import { isNullOrUndefined, isTypeOf, lastElement } from "./Utils";

export class ServiceProvider implements ServiceProviderServiceExtensions, ContextExtensions {
    #contextRegistry = ContextRegistry.GetInstance();
    #singletonContext?: Context;

    private get singletonContext() {
        return this.#singletonContext ?? (this.#singletonContext = this.Create());
    }

    constructor(private serviceCollection: AbstractServiceCollection) {
    }

    GetService<T>(serviceTypeOrInjectionToken: any, context?: Context): T | null {
        try {
            return this.GetRequiredService(serviceTypeOrInjectionToken, context);
        } catch (error) {
            if (!isTypeOf(error, ServiceNotFoundException)) {
                throw error;
            }
            return null;
        }
    }

    GetServices<T>(serviceTypeOrInjectionToken: any, context?: any): T[] {
        if (isNullOrUndefined(serviceTypeOrInjectionToken)) {
            throw new ArgumentException('Must provide service type', 'serviceType');
        }
        const descriptors = this.serviceCollection.GetServiceDescriptors(serviceTypeOrInjectionToken);
        return descriptors.map(descriptor => this.GetImplementation(descriptor, context));
    }


    GetRequiredService<T>(serviceTypeOrInjectionToken: any, context?: Context): T {
        if (isNullOrUndefined(serviceTypeOrInjectionToken)) {
            throw new ArgumentException('Must provide service type', 'serviceType');
        }
        const descriptor = lastElement(this.serviceCollection.GetServiceDescriptors(serviceTypeOrInjectionToken));
        if (isNullOrUndefined(descriptor)) {
            throw new ServiceNotFoundException(serviceTypeOrInjectionToken.name);
        }
        return this.GetImplementation(descriptor, context);
    }

    public Create() {
        const context = new Context();

        if (!(context instanceof Context)) {
            throw new ArgumentException(`${context} should be of type Context`, 'context');
        }

        if (this.#contextRegistry.Has(context)) {
            throw new InvalidOperationException("Context already in use.");
        }

        this.#contextRegistry.Add(context)

        return context;
    }

    public async CreateScope<T>(computation: (context: Context) => T | Promise<T>): Promise<T> {
        const context = this.Create();
        const result = await computation(context);
        this.Destroy(context);
        return result;
    }

    public Destroy(context: Context) {
        if (!(context instanceof Context)) {
            throw new ArgumentException(`${context} should be of type Context`, 'context');
        }

        if (!this.#contextRegistry.Has(context)) {
            throw new InvalidOperationException("Cannot find context");
        }

        this.#contextRegistry.Delete(context)
    }

    private GetImplementation(descriptor: ServiceDescriptor, context: Context | undefined) {
        switch (descriptor.lifetime) {
            case ServiceLifetime.Singleton:
                return descriptor.implementation(descriptor, this.singletonContext);
            case ServiceLifetime.Transient:
                return descriptor.implementation(descriptor, context);
            case ServiceLifetime.Scoped:
                if (!(context instanceof Context)) {
                    throw new ArgumentException(`${context} should be of type Context`, 'context');
                }
                return descriptor.implementation(descriptor, context);
            default:
                throw new InvalidOperationException(
                    `Lifetime ${ServiceLifetime[descriptor.lifetime]} is not supported.
                     it looks like problem with the library it self, please create an issue in Github
                     so it could be fixed.
                    `
                );
        }
    }

}
