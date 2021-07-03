import { GetServiceOptions } from "AbstractServiceCollection";
import { Context } from "../Context";
import { InjectionToken } from "../InjectionToken";
import { Type } from "../Types";

export abstract class ServiceProviderServiceExtensions {

    /**
     * Get service of type serviceType.
     * 
     * @param serviceType The type of the service to get.
     * 
     * @throws {ServiceNotFoundException} in case no service of type serviceType is registered.
     * 
     * @returns A service of type serviceType.
     */
    abstract GetRequiredService<T>(serviceType: Type<T>): T;

    /**
     * Get return value of `InjectionToken` implementationFactory.
     *
     * @param injectionToken Instance of InjectionToken.
     *
     * @throws {ServiceNotFoundException} in case injectionToken is not registered.
     *
     * @returns Return value of implementationFactory.
     */
    abstract GetRequiredService<T>(injectionToken: InjectionToken<T>): T;

    /**
     * Get service of type serviceType that is bound to that context.
     * 
     * Use this overload to get scoped or transient service.
     *
     * @param serviceType The type of the service to get.
     * @param context A context to bind the service to.
     *
     * @throws {ServiceNotFoundException} in case no service of type serviceType is registered.
     *
     * @returns A scoped service of type serviceType.
     */
    abstract GetRequiredService<T>(serviceType: Type<T>, context: Context): T;

    /**
     * Get return value of `InjectionToken` implementationFactory.
     * 
     * Use this overload to resolve scoped or transient InjectionToken implementationFactory.
     *
     * @param injectionToken Instance of InjectionToken.
     * @param context A context to bind `injectionToken` to.
     *
     * @throws {ServiceNotFoundException} in case injectionToken is not registered.
     *
     * @returns Return value of implementationFactory.
     */
    abstract GetRequiredService<T>(injectionToken: InjectionToken<T>, context: Context): T;

    /**
     * Get service or multiple services of type `serviceTypeOrOptions.serviceType`.
     *
     * @param serviceTypeOrOptions An option object that have the information about what to return.
     *
     * @throws {ServiceNotFoundException} in case no service of type `serviceTypeOrOptions.serviceType` is registered.
     *
     * @returns A service of type `serviceTypeOrOptions.serviceType`.
     */
    abstract GetRequiredService<T>(serviceTypeOrOptions: GetServiceOptions<T>): T[];

    /**
     * Get service of type serviceType.
     * 
     * @param serviceType The type of the service to get.
     * 
     * @returns A service of type serviceType or null if there is no such service.
     */
    abstract GetService<T>(serviceType: Type<T>): T;

    /**
     * Get return value of `InjectionToken` implementationFactory.
     *
     * @param injectionToken Instance of InjectionToken.
     *
     * @returns Return value of implementationFactory or null if there is no such service.
     */
    abstract GetService<T>(injectionToken: InjectionToken<T>): T;

    /**
     * Get service of type serviceType that is bound to that context.
     * 
     * Use this overload to get scoped or transient service.
     *
     * @param serviceType The type of the service to get.
     * @param context A context to bind the service to.
     *
     * @returns A scoped service of type serviceType or null if there is no such service.
     */
    abstract GetService<T>(serviceType: Type<T>, context: Context): T;

    /**
     * Get return value of `InjectionToken` implementationFactory.
     * 
     * Use this overload to resolve scoped or transient InjectionToken implementationFactory.
     *
     * @param injectionToken Instance of InjectionToken.
     * @param context A context to bind `injectionToken` to.
     *
     * @returns Return value of implementationFactory or null if there is no such service.
     */
    abstract GetService<T>(injectionToken: InjectionToken<T>, context: Context): T;

    /**
     * Get service or multiple services of type `serviceTypeOrOptions.serviceType`.
     *
     * @param serviceTypeOrOptions An option object that have the information about what to return.
     *
     * @returns A service of type `serviceTypeOrOptions.serviceType` or null if there is no such service.
     */
    abstract GetService<T>(serviceTypeOrOptions: GetServiceOptions<T>): T[];

    /**
     * Get array of services of type serviceType.
     * 
     * @param serviceType The type of the service to get.
     * 
     * @throws {ServiceNotFoundException} in case no service of type serviceType is registered.
     * 
     * @returns An array of services of type serviceType
     */
    abstract GetServices<T>(serviceType: Type<T>): T[];

    /**
     * Get array of services of type serviceType that is bound to that context.
     * 
     * Use this overload to get list of scoped or transient service.
     *
     * @param serviceType The type of the service to get.
     * @param context A context to bind the service to.
     *
     * @throws {ServiceNotFoundException} in case no service of type serviceType is registered.
     *
     * @returns An array of services of type serviceType
     */
    abstract GetServices<T>(serviceType: Type<T>, context: Context): T[];

}