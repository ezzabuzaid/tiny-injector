import { InjectionToken } from "InjectionToken";
import { InjectMetadata, Type } from "./Types";

export function Inject<T extends (Type<any> | InjectionToken<any>)>(serviceType: T): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        Reflect.defineMetadata(`DI:Inject:${ parameterIndex }`, {
            serviceType,
            parameterIndex,
            propertyKey
        } as InjectMetadata, target);
    }
}
