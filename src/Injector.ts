import "reflect-metadata";
import { Context } from "./Context";
import {
    ActivationFailedException,
    ArgumentException,
    InvalidOperationException,
    LifestyleMismatchException
} from "./Exceptions";
import { InjectionToken } from "./InjectionToken";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceLifetime } from "./ServiceLifetime";
import { isArrowFn, isConstructor, lastElement, notNullOrUndefined, Type } from './Utils';

type InjectionTokenGenericParam<C extends InjectionToken<any>> = C extends InjectionToken<infer T> ? T : unknown;

export class Injector {

    private static _instance: Injector;
    public static instance = Injector._instance ?? (Injector._instance = new Injector());

    #SingletonContext = new Context();
    #serviceCollection = new Map<Type<any>, ServiceDescriptor[]>();
    #contextsContainer = new Map<Context, WeakMap<ServiceDescriptor, InstanceType<any>>>();
    #toBeCreatedServices = new Map<Type<any>, Type<any>>();

    private constructor() {
        this.#contextsContainer.set(this.#SingletonContext, new WeakMap());
    }

    /**
     * Adds a singleton service of the injection token with a factory specified in implementationFactory.
     *
     * @description
     * Singleton services are created The first time they're requested.
     * the same result will be returned for each subsequent request.
     *
     * @param injectionToken The token to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    static AddSingleton<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    /**
     * Adds a singleton service of the type specified in serviceType with a factory specified in implementationFactory.
     * 
     * @description
     * Singleton services are created The first time they're requested.
     * the same instance will be resolved for each subsequent request.
     *
     * @param serviceType The type of the service to add.
     * @param implementationFactory the factory that creates the service.
     * 
     */
    static AddSingleton<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => InstanceType<T>): void;
    /**
     * Adds a singleton service of the type specified in serviceType with an implementation of the type specified in implementationType.
     * 
     * @description
     * Singleton services are created The first time they're requested.
     * the same instance will be resolved for each subsequent request.
     * 
     * @param serviceType The type of the service to add.
     * @param implementationType The type of the implementation to use.
     */
    static AddSingleton<T extends Type<any>, I extends T>(serviceType: T, implementationType: I): void;
    /**
     * Adds a singleton service of the type specified in serviceType.
     *
     * @description
     * Singleton services are created The first time they're requested.
     * the same instance will be resolved for each subsequent request.
     *
     * @param serviceType The type of the service to add.
     *
     */
    static AddSingleton<T extends Type<any>>(serviceType: T): void;
    static AddSingleton(serviceType: any, a?: any) {
        Injector.instance.AddService(serviceType, a, ServiceLifetime.Singleton);
    }
    /**
     * Adds a transient service of the injection token with a factory specified in implementationFactory.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored.
     *
     * @param injectionToken The token to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    static AddTransient<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    /**
     * Adds a transient service of the type specified in serviceType with a factory specified in implementationFactory.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored.
     *
     * @param serviceType - The type of the service to add.
     * @param implementationFactory - the factory that creates the service.
     */
    static AddTransient<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => InstanceType<T>): void;
    /**
     * Adds a transient service of the type specified in serviceType with an implementation of the type specified in implementationType.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored
     * 
     * @param serviceType - The type of the service to add.
     * @param implementationType - The type of the implementation to use.
     */
    static AddTransient<T extends Type<any>, I extends T>(serviceType: T, implementationType: I): void;
    /**
     * Adds a transient service of the type specified in serviceType.
     *
     * @description
     * Transient services are created each time they're requested, Unlike Singleton and Scoped, the reference for the implementation won't be stored
     *
     * @param serviceType - The type of the service to add.
     */
    static AddTransient<T extends Type<I>, I>(serviceType: T): void;
    static AddTransient(serviceType: any, implementation?: any) {
        Injector.instance.AddService(serviceType, implementation, ServiceLifetime.Transient);
    }
    /**
     * Adds a scoped service of the injection token with a factory specified in implementationFactory.
     *
     * @description
     * Scoped services are created once per context.
     *
     * @see {Injector.CreateScope}
     * @see {Injector.Create}
     * 
     * @param injectionToken The token to add.
     * @param implementationFactory the factory that creates the service.
     *
     */
    static AddScoped<T extends InjectionToken<any>>(injectionToken: T, implementationFactory: (context: Context) => InjectionTokenGenericParam<T>): void;
    /**
     * Adds a scoped service of the type specified in serviceType with a factory specified in implementationFactory.
     * 
     * @description
     * Scoped services are created once per context.
     *
     * @see {Injector.CreateScope}
     * @see {Injector.Create}
     *
     * @param serviceType The type of the service to add.
     * @param implementationFactory the factory that creates the service.
     */
    static AddScoped<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => InstanceType<T>): void;
    /**
     * Adds a scoped service of the type specified in serviceType with an implementation of the type specified in implementationType.
     *
     * @description
     * Scoped services are created once per context.
     *
     * @see {Injector.CreateScope}
     * @see {Injector.Create}
     * 
     * @param serviceType The type of the service to add.
     * @param implementationType The type of the implementation to use.
     */
    static AddScoped<T extends Type<any>, I extends T>(serviceType: T, implementationType: I): void;
    /**
     * Adds a scoped service of the type specified in serviceType.
     * 
     * @description
     * Scoped services are created once per context.
     *
     * @see {Injector.CreateScope}
     * @see {Injector.Create}
     *
     * @param serviceType The type of the service to add.
     */
    static AddScoped<T extends Type<I>, I>(serviceType: T): void;
    static AddScoped(serviceType: any, implementation?: any) {
        Injector.instance.AddService(serviceType, implementation, ServiceLifetime.Scoped);
    }

    /**
     * Appends a singleton service of the type specified in serviceType with a factory specified in implementationFactory.
     * 
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddSingleton will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * "@Inject(Interceptor) interceptors: Interceptor[]""
     *
     * @see AddSingleton
     *
     * @param serviceType The type of the service to add.
     * @param implementationFactory the factory that creates the service.
     * 
     */
    static AppendSingleton<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => InstanceType<T>): void;
    /**
     * Appends a singleton service of the type specified in serviceType with an implementation of the type specified in implementationType.
     * 
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     * 
     * This method introduced because AddSingleton will prevent the same serviceType from being added twice
     * 
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     * 
     * @see AddSingleton
     * 
     * @param serviceType The type of the service to add.
     * @param implementationType The type of the implementation to use.
     */
    static AppendSingleton<T, I extends T>(serviceType: T, implementationType: T): void;
    /**
     * Appends a singleton service of the type specified in serviceType.
     *
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddSingleton will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     *
     * @see AddSingleton
     *
     * @param serviceType The type of the service to add.
     *
     */
    static AppendSingleton<T extends Type<any>>(serviceType: T): void;
    static AppendSingleton(serviceType: any, implementation?: any) {
        Injector.instance.AppendService(serviceType, implementation, ServiceLifetime.Singleton);
    }

    /**
     * Appends a singleton service of the type specified in serviceType with a factory specified in implementationFactory.
     * 
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddTransient will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     *
     * @see AddTransient
     *
     * @param serviceType The type of the service to add.
     * @param implementationFactory the factory that creates the service.
     * 
     */
    static AppendTransient<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => InstanceType<T>): void;
    /**
     * Appends a Transient service of the type specified in serviceType with an implementation of the type specified in implementationType.
     * 
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     * 
     * This method introduced because AddTransient will prevent the same serviceType from being added twice
     * 
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     * 
     * @see AddTransient
     * 
     * @param serviceType The type of the service to add.
     * @param implementationType The type of the implementation to use.
     */
    static AppendTransient<T, I extends T>(serviceType: T, implementationType: T): void;
    /**
     * Appends a singleton service of the type specified in serviceType.
     *
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddTransient will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     *
     * @see AddTransient
     *
     * @param serviceType The type of the service to add.
     *
     */
    static AppendTransient<T extends Type<any>>(serviceType: T): void;
    static AppendTransient(serviceType: any, implementation?: any) {
        Injector.instance.AppendService(serviceType, implementation, ServiceLifetime.Transient);
    }

    /**
     * Appends a singleton service of the type specified in serviceType with a factory specified in implementationFactory.
     * 
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddScoped will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     *
     * @see AddScoped
     *
     * @param serviceType The type of the service to add.
     * @param implementationFactory the factory that creates the service.
     * 
     */
    static AppendScoped<T extends Type<any>>(serviceType: T, implementationFactory: (context: Context) => InstanceType<T>): void;
    /**
     * Appends a Scoped service of the type specified in serviceType with an implementation of the type specified in implementationType.
     * 
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     * 
     * This method introduced because AddScoped will prevent the same serviceType from being added twice
     * 
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     * 
     * @see AddScoped
     * 
     * @param serviceType The type of the service to add.
     * @param implementationType The type of the implementation to use.
     */
    static AppendScoped<T, I extends T>(serviceType: T, implementationType: T): void;
    /**
     * Adds a singleton service of the type specified in serviceType.
     *
     * @description
     * Use this method when you want to have different implementations for the same serviceType
     *
     * This method introduced because AddScoped will prevent the same serviceType from being added twice
     *
     * You'll need to use {@Inject} decorator to resolve array of implementations.
     * @Inject(Interceptor) interceptors: Interceptor[]
     *
     * @see AddScoped
     *
     * @param serviceType The type of the service to add.
     *
     */
    static AppendScoped<T extends Type<any>>(serviceType: T): void;
    static AppendScoped(serviceType: any, implementation?: any) {
        Injector.instance.AppendService(serviceType, implementation, ServiceLifetime.Scoped);
    }

    static Locate<T>(serviceType: Type<T> | InjectionToken<T>): T;
    static Locate<T>(serviceType: Type<T> | InjectionToken<T>, context: Context): T;
    static Locate<T>(serviceTypeOrOptions: { serviceType: Type<T>, multiple?: boolean, context?: Context }): T[];
    static Locate<T>(serviceType: any, context?: any): any {
        return Injector.instance.Locate(serviceType, context);
    }

    private ValidateService(serviceType: any, implementation: any) {
        if (!isConstructor(serviceType)) {
            throw new ArgumentException(`serviceType ${ serviceType?.name ?? '' } must be class syntax`, 'serviceType');
        }

        if (
            notNullOrUndefined(implementation)
            && !isConstructor(implementation)
            && !isArrowFn(implementation)
        ) {
            throw new ArgumentException('implementation can be either class or factory function (arrow function syntax)', 'implementation');
        }
    }

    private makeServiceDescriptor(serviceType: any, implementation: any, lifetime: ServiceLifetime) {
        const cache = (fn: Function) => {
            return (descriptor: ServiceDescriptor, context?: Context) => {
                if (!(context instanceof Context)) {
                    throw new InvalidOperationException(`Wrong context used to retrieve the dependency ${ serviceType.name }, make sure to use the same context that was used before with {Injector.Create}`);
                }
                const container = this.#contextsContainer.get(context)!;
                if (!(container instanceof WeakMap)) {
                    throw new InvalidOperationException(`context are not registered, use {Injector.Create} to register the context.`);
                }
                if (!container.has(descriptor)) {
                    container.set(descriptor, fn(context))
                }
                return container.get(descriptor);
            };
        }

        const resolver = (serviceType: Type<any>) => {
            switch (lifetime) {
                case ServiceLifetime.Scoped:
                    return cache(this.Resolve(serviceType, lifetime));
                case ServiceLifetime.Transient:
                    return (descriptor: ServiceDescriptor, context?: Context) => {
                        return this.Resolve(serviceType, lifetime)(context);
                    };
                case ServiceLifetime.Singleton:
                    return cache(this.Resolve(serviceType, lifetime));
            }
        }

        if (notNullOrUndefined(implementation)) {
            return new ServiceDescriptor(
                lifetime,
                isArrowFn(implementation)
                    ? (_, context) => {
                        return implementation(context);
                    }
                    : resolver(implementation)
            );
        } else {
            return new ServiceDescriptor(lifetime, resolver(serviceType));
        }
    }

    /**
     * @internal
     */
    public AddService(serviceType: any, implementation: any, lifetime: ServiceLifetime): void {
        this.ValidateService(serviceType, implementation);

        const currentDescriptors = this.#serviceCollection.get(serviceType);
        if (currentDescriptors) {
            const descriptor = currentDescriptors[0] as ServiceDescriptor;
            throw new InvalidOperationException(
                `You cannot override registered types. ${ serviceType.name } already registered as ${ descriptor.lifetimeType }`
            );
        }
        const descriptor = this.makeServiceDescriptor(serviceType, implementation, lifetime);

        const descriptors = this.#serviceCollection.get(serviceType) ?? [];
        descriptors.push(descriptor);
        this.#serviceCollection.set(serviceType, descriptors);

        const parentServiceType = this.#toBeCreatedServices.get(serviceType);
        if (parentServiceType) {
            this.ValidateSingletonLifetime(parentServiceType, this.getServiceTypeDependencies(parentServiceType));
            this.#toBeCreatedServices.delete(serviceType);
        }

        if (lifetime === ServiceLifetime.Singleton) {
            this.ValidateSingletonLifetime(serviceType, this.getServiceTypeDependencies(serviceType));
        }

    }

    /**
     * @internal
     */
    TryAddService(serviceType: Type<any>, implementation: any, lifetime: ServiceLifetime) {
        try {
            Injector.instance.AddService(serviceType, implementation, lifetime);
        } catch (error) {
            if (!(error instanceof Error)) {
                throw error;
            }
        }
    }

    /**
     * @internal
     */
    AppendService(serviceType: Type<any>, implementation: any, lifetime: ServiceLifetime) {
        this.ValidateService(serviceType, implementation);

        const descriptor = this.makeServiceDescriptor(serviceType, implementation, lifetime);

        const descriptors = this.#serviceCollection.get(serviceType) ?? [];
        descriptors.push(descriptor);
        this.#serviceCollection.set(serviceType, descriptors);
    }

    /**
     * @internal
     * 
     * TODO
     */
    private ReplaceService(serviceType: any, implementation: any, lifetime: ServiceLifetime) {
        this.ValidateService(serviceType, implementation);

        const descriptor = this.makeServiceDescriptor(serviceType, implementation, lifetime);
    }

    private ValidateSingletonLifetime(serviceType: Type<any>, tokens: Type<any>[]) {
        tokens.forEach((token, index) => {
            const injectMetadata = Reflect.getMetadata(`DI:Inject:${ index }`, serviceType);
            const argumentType = injectMetadata?.serviceType ?? token
            let descriptor: ServiceDescriptor;
            try {
                descriptor = lastElement(this.getServiceDescriptors(argumentType));
            } catch (error) {
                this.#toBeCreatedServices.set(argumentType, serviceType);
                // throw new ActivationFailedException(argumentType, serviceType);
                return;
            }

            // Only other Singleton services can be injected in Singleton service
            if (descriptor.lifetime !== ServiceLifetime.Singleton) {
                const serviceTypeDescriptor = lastElement(this.getServiceDescriptors(serviceType));
                throw new LifestyleMismatchException({
                    serviceType: serviceType,
                    injectedServiceType: argumentType,
                    serviceTypeLifetimeType: serviceTypeDescriptor.lifetimeType,
                    injectedServiceLifetimeType: descriptor.lifetimeType
                });
            }

        });
    }
    private ValidateTransientLifetime(serviceType: Type<any>, argumentType: Type<any>) {
        let descriptor: ServiceDescriptor;
        try {
            descriptor = lastElement(this.getServiceDescriptors(argumentType));
        } catch (error) {
            throw new ActivationFailedException(argumentType, serviceType);
        }

        if (descriptor.lifetime === ServiceLifetime.Scoped) {
            const serviceTypeDescriptor = lastElement(this.getServiceDescriptors(serviceType));
            throw new LifestyleMismatchException({
                serviceType: serviceType,
                injectedServiceType: argumentType,
                serviceTypeLifetimeType: serviceTypeDescriptor.lifetimeType,
                injectedServiceLifetimeType: descriptor.lifetimeType,
                needContext: true
            });
        }

    }

    getServiceTypeDependencies(serviceType: Type<any>): Type<any>[] {
        return Reflect.getMetadata('design:paramtypes', serviceType) ?? [];
    }

    private Resolve(serviceType: Type<any>, lifetime: ServiceLifetime) {
        // TODO: add option to disable SingletonLifetime validation
        const tokens = this.getServiceTypeDependencies(serviceType);

        return (context?: Context) => {
            return new serviceType(...tokens.map((token, index) => {
                const injectMetadata = Reflect.getMetadata(`DI:Inject:${ index }`, serviceType);
                const argumentType = injectMetadata?.serviceType ?? token

                // TODO: add option to disable TransientLifetime validation
                if (lifetime === ServiceLifetime.Transient && !(context instanceof Context)) {
                    this.ValidateTransientLifetime(serviceType, argumentType);
                }

                return this.Locate({ serviceType: argumentType, multiple: token === Array, context })
            }));
        }
    }

    /**
     * Create a context and immediately destroy it after computation is done.
     *
     * @param computation
     */
    static async CreateScope(computation: (context: Context) => Promise<void> | void) {
        const context = Injector.Create();
        await computation(context);
        Injector.Destroy(context);
    }

    /**
     * Create context
     */
    static Create() {
        const context = new Context();
        if (!(context instanceof Context)) {
            throw new ArgumentException(`${ context } should be of type Context`, 'context');
        }
        if (Injector.instance.#contextsContainer.has(context)) {
            throw new InvalidOperationException("Context already in use.");
        }
        Injector.instance.#contextsContainer.set(context, new WeakMap());
        return context;
    }

    static Destroy(context: Context) {
        if (!(context instanceof Context)) {
            throw new ArgumentException(`${ context } should be of type Context`, 'context');
        }

        if (!Injector.instance.#contextsContainer.has(context)) {
            throw new InvalidOperationException("Cannot find context");
        }

        Injector.instance.#contextsContainer.delete(context);
    }

    private getServiceDescriptors<T>(serviceType: Type<T>) {
        const descriptor = this.#serviceCollection.get(serviceType);
        if (descriptor === null || descriptor === undefined) {
            throw new InvalidOperationException(
                `Unable to resolve service for type '${ serviceType.name }'.`
            );
        }
        return descriptor;
    }

    public Locate<T>(serviceType: Type<T> | InjectionToken<T>): T;
    public Locate<T>(serviceType: Type<T> | InjectionToken<T>, context: Context): T;
    public Locate<T>(serviceTypeOrOptions: { serviceType: Type<T>, multiple?: boolean, context?: Context }): T | T[];
    public Locate<T>(serviceTypeOrOptions: any, context?: Context): any {
        const options: { serviceType: Type<T>, multiple: boolean, context?: Context } = {
            serviceType: isConstructor(serviceTypeOrOptions) ? serviceTypeOrOptions : serviceTypeOrOptions['serviceType'],
            multiple: isConstructor(serviceTypeOrOptions) ? false : serviceTypeOrOptions['multiple'],
            context: isConstructor(serviceTypeOrOptions) ? context : serviceTypeOrOptions['context']
        };
        const descriptors = this.getServiceDescriptors(options.serviceType);

        if (options.multiple) {
            return descriptors.map(descriptor => this.LocateService(descriptor, options.context));
        }

        return this.LocateService(lastElement(descriptors), options.context);
    }

    private LocateService(descriptor: ServiceDescriptor, context: Context | undefined) {
        switch (descriptor.lifetime) {
            case ServiceLifetime.Singleton:
                return this.LocateSingleton(descriptor);
            case ServiceLifetime.Transient:
                return this.LocateTransient(descriptor, context);
            case ServiceLifetime.Scoped:
                return this.LocateScoped(descriptor, context);
            default:
                throw new InvalidOperationException(
                    `Lifetime ${ ServiceLifetime[descriptor.lifetime] } is not supported.
                     it looks like problem with the library it self, please create an issue in Github
                     so the maintainer can fix it.
                    `
                );
        }
    }

    private LocateSingleton(descriptor: ServiceDescriptor) {
        return descriptor.implementation(descriptor, this.#SingletonContext);
    }

    private LocateScoped(descriptor: ServiceDescriptor, context: Context | undefined) {
        if (!(context instanceof Context)) {
            throw new ArgumentException(`${ context } should be of type Context`, 'context');
        }
        return descriptor.implementation(descriptor, context);
    }

    private LocateTransient(descriptor: ServiceDescriptor, context: Context | undefined) {
        return descriptor.implementation(descriptor, context);
    }

    Remove<T>(serviceType: Type<T>) {
        this.#serviceCollection.delete(serviceType);
    }

}


