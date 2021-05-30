import { Context } from "../Context";
import { InjectionToken } from "../InjectionToken";
import { ServiceProvider } from "../ServiceProvider";
import { Type } from "../Types";

export function Locate<T>(serviceType: Type<T>): T;
export function Locate<T>(serviceType: InjectionToken<T>): T;
export function Locate<T>(serviceType: Type<T>, context: Context): T;
export function Locate<T>(serviceType: InjectionToken<T>, context: Context): T;
export function Locate<T>(serviceTypeOrOptions: { serviceType: Type<T>, multiple?: boolean, context?: Context }): T[];
export function Locate<T>(serviceType: any, context?: any): any {
    return ServiceProvider.GetInstance().Locate(serviceType, context);
}