import { InvalidOperationException } from "./InvalidOperationException";

export class ResolutionFailedException extends InvalidOperationException {
    constructor(
        serviceTypeName: string
    ) {
        super(
            `Could not resolve type ${ serviceTypeName }.`
        );
    }
}