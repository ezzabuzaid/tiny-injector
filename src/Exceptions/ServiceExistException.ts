import { ServiceLifetime } from "../ServiceLifetime";
import { InvalidOperationException } from "./InvalidOperationException";

export class ServiceExistException extends InvalidOperationException {
    constructor(
        serviceTypeName: string,
        serviceTypeLifetime: string,
    ) {
        super(
            `You cannot override a registered type. the ${ serviceTypeName } is already registered as ${ serviceTypeLifetime }`
        );
    }
}