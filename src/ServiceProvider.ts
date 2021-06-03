import { AbstractServiceCollection, LocateOptions } from "./AbstractServiceCollection";
import { Context } from "./Context";
import { ContextRegistry } from "./ContextRegistry";
import { ArgumentException, InvalidOperationException, ServiceNotFoundException } from "./Exceptions";
import { CreateExtensions, GetServiceExtensions } from "./Extensions";
import { InjectionToken } from "./InjectionToken";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceLifetime } from "./ServiceLifetime";
import { Type } from "./Types";
import { isConstructor, isTypeOf, lastElement } from "./Utils";

export class ServiceProvider implements CreateExtensions, GetServiceExtensions {
    #contextRegistry = ContextRegistry.GetInstance();
    #singletonContext?: Context;

    private get singletonContext() {
        return this.#singletonContext ?? (this.#singletonContext = this.Create());
    }

    constructor(private serviceCollection: AbstractServiceCollection) {
    }

    public GetService(serviceTypeOrOptions: Type<any> | InjectionToken<any> | LocateOptions, context?: Context): any | any[] {
        try {
            return this.GetRequiredService(serviceTypeOrOptions, context);
        } catch (error) {
            if (!isTypeOf(error, ServiceNotFoundException)) {
                throw error;
            }
        }
    }

    public GetRequiredService(serviceTypeOrOptions: Type<any> | InjectionToken<any> | LocateOptions, context?: Context): any | any[] {
        let options: LocateOptions;
        if (isConstructor(serviceTypeOrOptions) || isTypeOf(serviceTypeOrOptions, InjectionToken)) {
            options = {
                serviceType: serviceTypeOrOptions,
                multiple: false,
                context: context
            };
        } else {
            options = serviceTypeOrOptions as typeof options;
        }
        const descriptors = this.serviceCollection.GetServiceDescriptors(options.serviceType);
        if (options.multiple) {
            return descriptors.map(descriptor => this.LocateService(descriptor, options.context));
        }
        return this.LocateService(lastElement(descriptors), options.context);

    }

    public Create() {
        const context = new Context();

        if (!(context instanceof Context)) {
            throw new ArgumentException(`${ context } should be of type Context`, 'context');
        }

        if (this.#contextRegistry.Has(context)) {
            throw new InvalidOperationException("Context already in use.");
        }

        this.#contextRegistry.Add(context)

        return context;
    }

    public async CreateScope(computation: (context: Context) => void | Promise<void>): Promise<void> {
        const context = this.Create();
        await computation(context);
        this.Destroy(context);
    }

    public Destroy(context: Context) {
        if (!(context instanceof Context)) {
            throw new ArgumentException(`${ context } should be of type Context`, 'context');
        }

        if (!this.#contextRegistry.Has(context)) {
            throw new InvalidOperationException("Cannot find context");
        }

        this.#contextRegistry.Delete(context)
    }

    private LocateService(descriptor: ServiceDescriptor, context: Context | undefined) {
        switch (descriptor.lifetime) {
            case ServiceLifetime.Singleton:
                return descriptor.implementation(descriptor, this.singletonContext);
            case ServiceLifetime.Transient:
                return descriptor.implementation(descriptor, context);
            case ServiceLifetime.Scoped:
                if (!(context instanceof Context)) {
                    throw new ArgumentException(`${ context } should be of type Context`, 'context');
                }
                return descriptor.implementation(descriptor, context);
            default:
                throw new InvalidOperationException(
                    `Lifetime ${ ServiceLifetime[descriptor.lifetime] } is not supported.
                     it looks like problem with the library it self, please create an issue in Github
                     so it could be fixed.
                    `
                );
        }
    }

}