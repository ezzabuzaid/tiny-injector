import "reflect-metadata";
import { AbstractServiceCollection } from "./AbstractServiceCollection";
import { Context } from "./Context";
import { ContextRegistry } from "./ContextRegistry";
import {
    ActivationFailedException,
    ArgumentException,
    InvalidOperationException,
    LifestyleMismatchException,
    ResolutionFailedException,
    ServiceExistException,
    ServiceNotFoundException
} from "./Exceptions";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceLifetime } from "./ServiceLifetime";
import { ServiceProvider } from "./ServiceProvider";
import { ClassType, ImplementationFactory, InjectMetadata, Type } from "./Types";
import { isArrowFn, isConstructor, isNullOrUndefined, isTypeOf, lastElement, notNullOrUndefined } from './Utils';

export class ServiceCollection extends AbstractServiceCollection {

    #serviceCollection = new Map<Type<any>, ServiceDescriptor[]>();
    #toBeCreatedServices = new Map<Type<any>, Type<any>>();
    #serviceProvider!: ServiceProvider;

    AppendTransient(serviceType: any, implementation?: any) {
        this.AppendService(serviceType, implementation, ServiceLifetime.Transient);
    }

    AppendSingleton(serviceType: any, implementation?: any) {
        this.AppendService(serviceType, implementation, ServiceLifetime.Singleton);
    }

    AppendScoped(serviceType: any, implementation?: any) {
        this.AppendService(serviceType, implementation, ServiceLifetime.Scoped);
    }

    AddScoped(serviceType: any, implementation?: any) {
        this.AddService(serviceType, implementation, ServiceLifetime.Scoped);
    }

    AddSingleton(serviceType: any, implementation?: any) {
        this.AddService(serviceType, implementation, ServiceLifetime.Singleton);
    }

    AddTransient(serviceType: any, implementation?: any) {
        this.AddService(serviceType, implementation, ServiceLifetime.Transient);
    }

    HasService(serviceType: Type<any>): boolean {
        return this.#serviceCollection.has(serviceType);
    }

    /**
     * @internal
     */
    public AddService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void {
        this.ValidateService(serviceType, implementation);

        const currentDescriptors = this.#serviceCollection.get(serviceType);
        if (currentDescriptors) {
            const descriptor = currentDescriptors[0] as ServiceDescriptor;
            throw new ServiceExistException(
                serviceType.name,
                descriptor.lifetimeType
            );
        }
        const descriptor = this.MakeServiceDescriptor(serviceType, implementation, lifetime);

        const descriptors = this.#serviceCollection.get(serviceType) ?? [];
        descriptors.push(descriptor);
        this.#serviceCollection.set(serviceType, descriptors);

        const parentServiceType = this.#toBeCreatedServices.get(serviceType);
        if (parentServiceType) {
            this.ValidateSingletonLifetime(parentServiceType, this.GetServiceDependencies(parentServiceType));
            this.#toBeCreatedServices.delete(serviceType);
        }

        if (lifetime === ServiceLifetime.Singleton) {
            this.ValidateSingletonLifetime(serviceType, this.GetServiceDependencies(serviceType));
        }

    }

    /**
     * @internal
     */
    public TryAddService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void {
        try {
            this.AddService(serviceType, implementation, lifetime);
        } catch (error) {
            if (!isTypeOf(error, ServiceExistException)) {
                throw error;
            }
        }
    }

    /**
     * @internal
     */
    public AppendService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void {
        this.ValidateService(serviceType, implementation);

        const descriptor = this.MakeServiceDescriptor(serviceType, implementation, lifetime);

        const descriptors = this.#serviceCollection.get(serviceType) ?? [];
        descriptors.push(descriptor);
        this.#serviceCollection.set(serviceType, descriptors);
    }

    /**
     * @internal
     * 
     */
    public ReplaceService<T>(serviceType: Type<T>, implementation: ClassType<T> | ImplementationFactory<T>, lifetime: ServiceLifetime): void {
        this.ValidateService(serviceType, implementation);

        const descriptor = this.MakeServiceDescriptor(serviceType, implementation, lifetime);
    }

    public Remove<T>(serviceType: Type<T>) {
        this.#serviceCollection.delete(serviceType);
    }

    public GetServiceDescriptors<T>(serviceType: Type<T>) {
        const descriptor = this.#serviceCollection.get(serviceType);
        if (isNullOrUndefined(descriptor)) {
            throw new ServiceNotFoundException(serviceType.name);
        }
        return descriptor;
    }

    public BuildServiceProvider() {
        this.#serviceProvider ??= new ServiceProvider(this)
        return this.#serviceProvider;
    }

    private GetServiceDependencies(serviceType: Type<any>): Type<any>[] {
        return Reflect.getMetadata('design:paramtypes', serviceType) ?? [];
    }

    private GetServiceInjectMeta(serviceType: Type<any>, index: number): InjectMetadata {
        return Reflect.getMetadata(`DI:Inject:${ index }`, serviceType);
    }

    private ValidateService(serviceType: any, implementation: any) {
        if (!isConstructor(serviceType)) {
            throw new ArgumentException(`the serviceType ${ serviceType?.name ?? '' } cannot be added. it must be class syntax`, 'serviceType');
        }

        if (
            notNullOrUndefined(implementation)
            && !isConstructor(implementation)
            && !isArrowFn(implementation)
        ) {
            throw new ArgumentException('implementation can be either class or factory function (arrow function syntax)', 'implementation');
        }
    }

    private ValidateSingletonLifetime(serviceType: Type<any>, tokens: Type<any>[]) {
        tokens.forEach((token, index) => {
            const injectMetadata = this.GetServiceInjectMeta(serviceType, index);
            const argumentType = injectMetadata?.serviceType ?? token
            let descriptor: ServiceDescriptor;
            try {
                descriptor = lastElement(this.GetServiceDescriptors(argumentType));
            } catch (error) {
                this.#toBeCreatedServices.set(argumentType, serviceType);
                // throw new ActivationFailedException(argumentType, serviceType);
                return;
            }

            // Only other Singleton services can be injected in Singleton service
            if (descriptor.lifetime !== ServiceLifetime.Singleton) {
                const serviceTypeDescriptor = lastElement(this.GetServiceDescriptors(serviceType));
                throw new LifestyleMismatchException({
                    serviceType: serviceType,
                    injectedServiceType: argumentType,
                    serviceTypeLifetimeType: serviceTypeDescriptor.lifetimeType,
                    injectedServiceLifetimeType: descriptor.lifetimeType
                });
            }

        });
    }

    private MakeServiceDescriptor(parentServiceType: any, implementation: any, lifetime: ServiceLifetime) {
        const resolver = (serviceTypeOrFactory: ClassType<any> | ImplementationFactory<any>) => {
            if (lifetime === ServiceLifetime.Transient) {
                return (descriptor: ServiceDescriptor, context?: Context) => {
                    if (isArrowFn(serviceTypeOrFactory)) {
                        return serviceTypeOrFactory(context);
                    }
                    return this.Resolve(serviceTypeOrFactory, lifetime)(context);
                };
            }
            if (isArrowFn(serviceTypeOrFactory)) {
                return this.Cache(parentServiceType, serviceTypeOrFactory);
            }
            return this.Cache(parentServiceType, this.Resolve(serviceTypeOrFactory, lifetime));
        }

        return new ServiceDescriptor(lifetime, resolver(implementation ?? parentServiceType));
    }

    private Resolve(serviceType: ClassType<any>, lifetime: ServiceLifetime): ImplementationFactory<any> {
        // TODO: add option to disable SingletonLifetime validation
        return (context?: Context) => {
            const tokens = this.GetServiceDependencies(serviceType);

            return new serviceType(...tokens.map((token, index) => {
                const injectMetadata = this.GetServiceInjectMeta(serviceType, index);
                const argumentType = injectMetadata?.serviceType ?? token

                // TODO: add option to disable TransientLifetime validation
                if (lifetime === ServiceLifetime.Transient && !(context instanceof Context)) {
                    this.ValidateTransientLifetime(serviceType, argumentType);
                }
                return this.#serviceProvider.GetRequiredService({ serviceType: argumentType, multiple: token === Array, context })
            }));
        }
    }

    private Cache<T extends Type<any>>(serviceType: T, fn: Function) {
        return (descriptor: ServiceDescriptor, context?: Context) => {
            if (!(context instanceof Context)) {
                throw new InvalidOperationException(`Wrong context used to retrieve the dependency ${ serviceType.name }, make sure to use the same context that was used before with {Injector.Create}`);
            }
            const container = ContextRegistry.GetInstance().GetContainer(context);
            if (!(container instanceof WeakMap)) {
                throw new InvalidOperationException(`Context are not registered, use {Injector.Create} to register the context.`);
            }
            if (!container.has(descriptor)) {
                container.set(descriptor, fn(context))
            }
            const result = container.get(descriptor);
            if (isNullOrUndefined(result)) {
                throw new ResolutionFailedException(serviceType.name);
            }
            return result;
        };
    }

    private ValidateTransientLifetime(serviceType: Type<any>, argumentType: Type<any>) {
        let descriptor: ServiceDescriptor;
        try {
            descriptor = lastElement(this.GetServiceDescriptors(argumentType));
        } catch (error) {
            throw new ActivationFailedException(argumentType, serviceType);
        }

        if (descriptor.lifetime === ServiceLifetime.Scoped) {
            const serviceTypeDescriptor = lastElement(this.GetServiceDescriptors(serviceType));
            throw new LifestyleMismatchException({
                serviceType: serviceType,
                injectedServiceType: argumentType,
                serviceTypeLifetimeType: serviceTypeDescriptor.lifetimeType,
                injectedServiceLifetimeType: descriptor.lifetimeType,
                needContext: true
            });
        }

    }

}


