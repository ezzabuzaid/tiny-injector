import { ClassType, Type } from "Types";


export function isConstructor(value: any) {
    if (isNullOrUndefined(value)) {
        return false;
    }

    if (value.toString().startsWith('function')) {
        return false;
    }

    return !!value.prototype && !!value.prototype.constructor.name;
}

export function isArrowFn(fn: any): fn is (...args: any[]) => any {
    return (typeof fn === 'function') && /^[^{]+?=>/.test(fn.toString());
};

export function isNullOrUndefined<T>(value: T): boolean {
    return value === undefined || value === null;
}

export function notNullOrUndefined<T>(value: T): value is T {
    return !isNullOrUndefined(value);
}

export function lastElement<T>(list: T[]): T {
    return list[list.length - 1] as T;
}
/**
 * Check if error is instanceOf type but not any of it's parent
 */
export function isTypeOf<T extends ClassType<any>>(error: any, type: T): error is InstanceType<T> {
    return Object.getPrototypeOf(error).constructor === type;
}
