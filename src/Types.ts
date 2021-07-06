import { Context } from "./Context";


export type ClassType<T> = new (...args: any[]) => T;

export declare interface AbstractClassType<T> extends Function {
    prototype: T;
}

export type ServiceType<T> = ClassType<T> | AbstractClassType<T>;


export type TypeOf<T extends ServiceType<any>> = T extends new (...args: any) => infer R
    ? R : T extends { prototype: infer R } ? R : any;

export type ImplementationFactory<T> = (context?: Context) => T;

export interface InjectMetadata {
    serviceType: ServiceType<any>;
    parameterIndex: number;
    propertyKey: string | symbol;
}