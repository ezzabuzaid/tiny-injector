import { InvalidOperationException } from "./InvalidOperationException";

export class ServiceNotFoundException extends InvalidOperationException {
    constructor(
        serviceTypeName: string,
    ) {
        super(`Unable to resolve service for type ${ serviceTypeName }`);
    }
}