import { ServiceType } from "../Types";
import { InvalidOperationException } from "./InvalidOperationException";

export class ActivationFailedException extends InvalidOperationException {
    constructor(
        serviceType: ServiceType<any>,
        injectedServiceType: ServiceType<any>,
    ) {
        super(
            `Unable to resolve service for type '${ injectedServiceType.name }' while attempting to activate '${ serviceType.name }'.`
        )
    }
}