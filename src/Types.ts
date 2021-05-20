

export type ClassType<T> = new (...args: any[]) => T;

export declare interface AbstractClassType<T> extends Function {
    prototype: T;
}

export type Type<T> = ClassType<T> | AbstractClassType<T>;


export type TypeOf<T extends Type<any>> = T extends new (...args: any) => infer R
    ? R : T extends { prototype: infer R } ? R : any;
