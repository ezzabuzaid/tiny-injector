import { Context } from "./Context";
import { ServiceLifetime } from "./ServiceLifetime";
export class ServiceDescriptor {
    constructor(
        public readonly lifetime: ServiceLifetime,
        public readonly implementation: (self: ServiceDescriptor, context?: Context | undefined) => any
    ) {
        Object.seal(this);
        Object.freeze(this);
    }

    get lifetimeType() {
        return ServiceLifetime[this.lifetime]!;
    }

}
