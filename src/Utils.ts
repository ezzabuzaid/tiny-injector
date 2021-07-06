import { ClassType, ServiceType } from "./Types";


export function isConstructor(value: any): value is ServiceType<any> {
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

export function isNullOrUndefined(value: any): value is undefined | null {
    return value === undefined || value === null;
}

export function notNullOrUndefined<T>(value: T): value is Exclude<T, null | undefined> {
    return !isNullOrUndefined(value);
}

export function lastElement<T>(list: T[]): T | undefined {
    return list[list.length - 1];
}
/**
 * Check if error is instanceOf type but not any of it's parent
 */
export function isTypeOf<T extends ClassType<any>>(error: any, type: T): error is T {
    return Object.getPrototypeOf(error).constructor === type;
}
