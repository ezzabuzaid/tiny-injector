import { InjectionToken } from "InjectionToken";
import { InjectMetadata, ServiceType } from "./Types";

export function Inject<T extends (ServiceType<any> | InjectionToken<any>)>(serviceType: T): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        Reflect.defineMetadata(`DI:Inject:${ parameterIndex }`, {
            serviceType,
            parameterIndex,
            propertyKey
        } as InjectMetadata, target);
    }
}
