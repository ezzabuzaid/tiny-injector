import { ClassType } from "../src/Types";
import { isTypeOf } from "../src/Utils";

export function getSupportedServiceTypeTypes() {
    return [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' ']
}

export function getSupportedImplementationTypeTypes() {
    return [{}, function () { }, [], false, true, '', ' '];
}

expect.extend({
    toThrowErrorOfType: (received, actual) => {
        try {
            received();
            return { pass: false, message: () => 'No error thrown' };
        } catch (error) {
            const pass = isTypeOf(error, actual);
            return { pass: isTypeOf(error, actual), message: () => pass ? '' : `${(<Error> error).name} is not ${actual.name}` };
        }
    }
});

declare global {
    namespace jest {
        interface Matchers<R> {
            toThrowErrorOfType(errorType: ClassType<any>): R
        }
    }
}
