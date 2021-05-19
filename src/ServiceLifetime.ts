export enum ServiceLifetime {
    /**
     * Specifies that a new instance of the service will be created for each scope.
     * 
     * Scope can be created by supplying arbitary object
     */
    Scoped = 1,
    /**
     * Specifies that a new instance of the service will be created every time it is requested.
     */
    Transient,
    /**
     * Specifies that a single instance of the service will be created.
     */
    Singleton
}
