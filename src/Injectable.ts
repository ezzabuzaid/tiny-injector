import { AbstractServiceCollection } from "./AbstractServiceCollection";
import { ArgumentException } from "./Exceptions";
import RootServiceCollection from "./RootServiceCollection";
import { ServiceLifetime } from "./ServiceLifetime";
import { Type } from "./Types";
import { isNullOrUndefined, notNullOrUndefined } from "./Utils";

interface InjectableOptions {
    /**
     * ```
     * class Test {}
     * 
     * @Injectable({
     *  serviceType: Test,
     *  lifetime: ServiceLifetime.Singleton
     * })
     * class MyService {}
     * ```
     * Alias to
     * ```
     * Injector.AddSingleton(Test, MyService)
     * Injector.GetRequiredService(Test) // will return MyService instance
     * ```
     * 
     * if not specifed, the serviceType will be the implementationType
     * ```
     * Injector.AddSingleton(MyService, MyService)
     * Injector.GetRequiredService(MyService) // will return MyService instance
     * ```
     */
    serviceType?: Type<any>;
    /**
     * Lifetime of the service
     */
    lifetime: ServiceLifetime;

    provideIn?: 'root' | AbstractServiceCollection;
}

/**
 * Decorator that makes a service available to be injected as a dependency.
 * 
 * it takes option parameter that used to add the class to the injector directly
 * ```
 * "@Injectable({
 *  lifetime: ServiceLifetime.Singleton
 * })
 * class MySingletonService { }"
 * ```
 * @param options 
 */
export function Injectable(options?: InjectableOptions): ClassDecorator {
    return function (target: Function) {
        // TODO: validate options.serviceType

        // TODO: add option to specify if the service should be replaced if exist
        // the option should be function callback style that returns boolean
        // if false is returned an error should be thrown in case of existance
        // if true is returned the service should be replaced
        // replaceOnExist: () => boolean

        // TODO: add option to skip adding the service if exist
        // tryAddService: boolean;

        if (isNullOrUndefined(options)) {
            return;
        }

        const injectableOptions = Object.assign({}, options);
        injectableOptions.provideIn ??= 'root';
        const serviceCollection = injectableOptions.provideIn === 'root' ? RootServiceCollection : injectableOptions.provideIn;
        if (!(serviceCollection instanceof AbstractServiceCollection)) {
            throw new ArgumentException('@Injectable providedIn accepts only "root" or instance of AbstractServiceCollection', 'options.providedIn')
        }

        switch (injectableOptions.lifetime) {
            case ServiceLifetime.Scoped:
                serviceCollection.AddScoped(injectableOptions.serviceType ?? target, target as any)
                break;
            case ServiceLifetime.Singleton:
                serviceCollection.AddSingleton(injectableOptions.serviceType ?? target, target as any)
                break;
            case ServiceLifetime.Transient:
                serviceCollection.AddTransient(injectableOptions.serviceType ?? target, target as any)
                break;
            default:
                throw new ArgumentException('@Injectable lifetime is unknown', 'options.lifetime')
        }
    };
}
