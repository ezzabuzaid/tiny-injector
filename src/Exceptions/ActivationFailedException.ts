import { Type } from "../Utils";
import { InvalidOperationException } from "./InvalidOperationException";

export class ActivationFailedException extends InvalidOperationException {
    constructor(
        serviceType: Type<any>,
        injectedServiceType: Type<any>,
    ) {
        super(
            `Unable to resolve service for type '${ injectedServiceType.name }' while attempting to activate '${ serviceType.name }'.`
        )
    }
}