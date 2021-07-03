export class ServiceProviderOptions {
    constructor(
        public disableSingletonLifetimeValidation: boolean,
        public disableTransientLifetimeValidation: boolean,
        public disableStrictTypeValidation: boolean,
        /**
         * 
         */
        public allowFunctionAsServiceType: boolean
    ) { }
}
