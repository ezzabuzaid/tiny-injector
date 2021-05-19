
export type Type<T> = new (...args: any[]) => T;

export function isConstructor(value: any) {
    if (isNullOrUndefined(value)) {
        return false;
    }

    if (value.toString().startsWith('function')) {
        return false;
    }

    return !!value.prototype && !!value.prototype.constructor.name;
}

export const isArrowFn = (fn: any) => (typeof fn === 'function') && /^[^{]+?=>/.test(fn.toString());

export function isNullOrUndefined<T>(value: T): boolean {
    return value === undefined || value === null;
}

export function notNullOrUndefined(value: any) {
    return !isNullOrUndefined(value);
}

export function lastElement<T>(list: T[]): T {
    return list[list.length - 1] as T;
}
