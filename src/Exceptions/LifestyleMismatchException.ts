import { ServiceType } from "../Types";
import { InvalidOperationException } from "./InvalidOperationException";

export class LifestyleMismatchException extends InvalidOperationException {
    constructor(details: {
        serviceType: ServiceType<any>,
        injectedServiceType: ServiceType<any>,
        serviceTypeLifetimeType: string,
        injectedServiceLifetimeType: string,
        needContext?: boolean
    }
    ) {
        super(
            `Cannot consume ${ details.injectedServiceLifetimeType } service ${ details.injectedServiceType.name } from ${ details.serviceTypeLifetimeType } service ${ details.serviceType.name } ${ details.needContext ? 'without context' : '' }.`
        )
    }
}