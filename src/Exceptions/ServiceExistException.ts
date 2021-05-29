import { ServiceLifetime } from "../ServiceLifetime";
import { InvalidOperationException } from "./InvalidOperationException";

export class ServiceExistException extends InvalidOperationException {
    constructor(
        serviceTypeName: string,
        serviceTypeLifetime: ServiceLifetime,
    ) {
        super(
            `You cannot override registered types. ${ serviceTypeName } already registered as ${ serviceTypeLifetime }`
        );
    }
}