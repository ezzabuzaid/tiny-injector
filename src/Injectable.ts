import { Injector } from "./Injector";
import { ServiceLifetime } from "./ServiceLifetime";
import { Type } from "./Types";

interface Options {
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
     * Injector.Locate(Test) // will return MyService instance
     * ```
     * 
     * if not specifed, the serviceType will be the implementationType
     * ```
     * Injector.AddSingleton(MyService, MyService)
     * Injector.Locate(MyService) // will return MyService instance
     * ```
     */
    serviceType?: Type<any>;
    /**
     * Lifetime of the service
     */
    lifetime: ServiceLifetime;
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
export function Injectable(options?: Options): ClassDecorator {
    return function (target: Function) {
        if (options && ServiceLifetime[options.lifetime]) {
            Injector.instance.AddService(options.serviceType ?? target, target, options.lifetime)
        }
    };
}
