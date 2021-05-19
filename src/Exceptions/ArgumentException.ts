
export class ArgumentException extends Error {
    constructor(message: string, paramName?: string) {
        super(`${ message }${ paramName ? `\nParameter name: ${ paramName }` : '' }`);
    }
}