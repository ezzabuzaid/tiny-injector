import { LocateOptions } from "AbstractServiceCollection";
import { Context } from "../Context";
import { InjectionToken } from "../InjectionToken";
import { Type } from "../Types";

export abstract class GetServiceExtensions {
    abstract GetRequiredService<T>(serviceType: Type<T>): T;
    abstract GetRequiredService<T>(serviceType: InjectionToken<T>): T;
    abstract GetRequiredService<T>(serviceType: Type<T>, context: Context): T;
    abstract GetRequiredService<T>(serviceType: InjectionToken<T>, context: Context): T;
    abstract GetRequiredService<T>(serviceTypeOrOptions: { serviceType: Type<T>, multiple?: boolean, context?: Context }): T[];

    abstract GetService(serviceTypeOrOptions: Type<any> | InjectionToken<any> | LocateOptions, context?: Context): any | any[];

}