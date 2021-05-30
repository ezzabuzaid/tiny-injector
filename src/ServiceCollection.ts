import "reflect-metadata";
import { AbstractServiceCollection } from "./AbstractServiceCollection";
import { Context } from "./Context";
import {
    ActivationFailedException,
    ArgumentException,
    InvalidOperationException,
    LifestyleMismatchException,
    ServiceExistException,
    ServiceNotFoundException
} from "./Exceptions";
import { ServiceDescriptor } from "./ServiceDescriptor";
import { ServiceLifetime } from "./ServiceLifetime";
import { ServiceProvider } from "./ServiceProvider";
import { ClassType, ImplementationFactory, Type, TypeOf } from "./Types";
import { isArrowFn, isConstructor, isNullOrUndefined, isTypeOf, lastElement, notNullOrUndefined } from './Utils';


export class ServiceCollection extends AbstractServiceCollection {


    #serviceCollection = new Map<Type<any>, ServiceDescriptor[]>();
    #contextsContainer = new Map<Context, WeakMap<ServiceDescriptor, TypeOf<any>>>();
    #toBeCreatedServices = new Map<Type<any>, Type<any>>();

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
            this.ValidateSingletonLifetime(parentServiceType, this.GetServiceTypeDependencies(parentServiceType));
            this.#toBeCreatedServices.delete(serviceType);
        }

        if (lifetime === ServiceLifetime.Singleton) {
            this.ValidateSingletonLifetime(serviceType, this.GetServiceTypeDependencies(serviceType));
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

    public DeleteContext(context: Context): void {
        this.#contextsContainer.delete(context);
    }

    public HasContext(context: Context): boolean {
        return this.#contextsContainer.has(context);
    }

    public GetContext(context: Context) {
        return this.#contextsContainer.get(context);
    }

    public AddContext(context: Context): void {
        this.#contextsContainer.set(context, new WeakMap());
    }

    public getServiceDescriptors<T>(serviceType: Type<T>) {
        const descriptor = this.#serviceCollection.get(serviceType);
        if (isNullOrUndefined(descriptor)) {
            throw new ServiceNotFoundException(serviceType.name);
        }
        return descriptor;
    }

    private Resolve(serviceType: ClassType<any>, lifetime: ServiceLifetime) {
        // TODO: add option to disable SingletonLifetime validation
        return (context?: Context) => {
            const tokens = this.GetServiceTypeDependencies(serviceType);
            return new serviceType(...tokens.map((token, index) => {
                const injectMetadata = Reflect.getMetadata(`DI:Inject:${ index }`, serviceType);
                const argumentType = injectMetadata?.serviceType ?? token

                // TODO: add option to disable TransientLifetime validation
                if (lifetime === ServiceLifetime.Transient && !(context instanceof Context)) {
                    this.ValidateTransientLifetime(serviceType, argumentType);
                }

                return ServiceProvider.GetInstance().GetRequiredService({ serviceType: argumentType, multiple: token === Array, context })
            }));
        }
    }
    BuildServiceProvider() {
        /**
         * return new ServiceProvider(collection: this);
         */
    }

    private MakeServiceDescriptor(serviceType: any, implementation: any, lifetime: ServiceLifetime) {
        const resolver = (serviceTypeOrFactory: ClassType<any> | ((context?: Context) => any)) => {
            if (lifetime === ServiceLifetime.Transient) {
                return (descriptor: ServiceDescriptor, context?: Context) => {
                    if (isArrowFn(serviceTypeOrFactory)) {
                        return serviceTypeOrFactory(context);
                    }
                    return this.Resolve(serviceTypeOrFactory, lifetime)(context);
                };
            }
            if (isArrowFn(serviceTypeOrFactory)) {
                return this.Cache(serviceType, serviceTypeOrFactory);
            }
            return this.Cache(serviceType, this.Resolve(serviceTypeOrFactory, lifetime));
        }

        return new ServiceDescriptor(lifetime, resolver(implementation ?? serviceType));
    }

    private Cache(serviceType: ClassType<any>, fn: Function) {
        return (descriptor: ServiceDescriptor, context?: Context) => {
            if (!(context instanceof Context)) {
                throw new InvalidOperationException(`Wrong context used to retrieve the dependency ${ serviceType.name }, make sure to use the same context that was used before with {Injector.Create}`);
            }
            const container = this.#contextsContainer.get(context)!;
            if (!(container instanceof WeakMap)) {
                throw new InvalidOperationException(`Context are not registered, use {Injector.Create} to register the context.`);
            }
            if (!container.has(descriptor)) {
                container.set(descriptor, fn(context))
            }
            return container.get(descriptor);
        };
    }

    private GetServiceTypeDependencies(serviceType: Type<any>): Type<any>[] {
        return Reflect.getMetadata('design:paramtypes', serviceType) ?? [];
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

}


