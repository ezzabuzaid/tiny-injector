import { InvalidOperationException } from "./InvalidOperationException";

export class ServiceNotFoundException extends InvalidOperationException {
    constructor(
        serviceTypeName: string,
    ) {
        super(`There is no service of type ${ serviceTypeName }`);
    }
}