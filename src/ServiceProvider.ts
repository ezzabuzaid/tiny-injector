import { AbstractServiceCollection, LocateOptions } from "./AbstractServiceCollection";
import { Context } from "./Context";
import { ArgumentException, InvalidOperationException, ServiceNotFoundException } from "./Exceptions";
import { InjectionToken } from "./InjectionToken";
import { ServiceCollection } from "./ServiceCollection";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceLifetime } from "./ServiceLifetime";
import { Type } from "./Types";
import { isConstructor, isTypeOf, lastElement } from "./Utils";

export class ServiceProvider {
    #serviceCollection: AbstractServiceCollection = new ServiceCollection();
    #singletonContext = this.Create();

    private constructor() {
        this.#serviceCollection.AddService(AbstractServiceCollection, () => this.#serviceCollection, ServiceLifetime.Singleton);
        this.#serviceCollection.AddService(Context, (context) => context, ServiceLifetime.Scoped);
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

        const descriptors = this.#serviceCollection.getServiceDescriptors(options.serviceType);
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

        if (this.#serviceCollection.HasContext(context)) {
            throw new InvalidOperationException("Context already in use.");
        }
        this.#serviceCollection.AddContext(context);
        return context;
    }

    public CreateScope() {
        throw new Error("Method is not implemented.");
    }

    public Destroy() {
        throw new Error("Method is not implemented.");
    }

    private LocateService(descriptor: ServiceDescriptor, context: Context | undefined) {
        switch (descriptor.lifetime) {
            case ServiceLifetime.Singleton:
                return descriptor.implementation(descriptor, this.#singletonContext);
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

    private static _instance: ServiceProvider;

    static GetInstance() {
        return ServiceProvider._instance ?? (ServiceProvider._instance = new ServiceProvider());
    }

}