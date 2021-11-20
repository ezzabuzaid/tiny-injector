import { ArgumentException, Context, Injectable, Injector, ServiceNotFoundException } from "../src";
import { getSupportedImplementationTypeTypes, getSupportedServiceTypeTypes } from "./utils";

describe('TryAddSingleton', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.TryAddSingleton(type as any))
                    .toThrowError(ArgumentException);
            });
        });
    });

    describe('PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
        @Injectable()
        class Service { }

        const types = getSupportedImplementationTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.TryAddSingleton(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('ServiceNotExist_ServiceWillBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }

        Injector.TryAddSingleton(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service);
        expect(service).toBeInstanceOf(ToBeAddedService);
    });

    it('ServiceExist_ServiceWillNotBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class ToBeIgnoredService extends Service {
            rid = Math.random();
        }

        Injector.TryAddSingleton(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service);
        expect(service).toBeInstanceOf(ToBeAddedService);

        Injector.TryAddSingleton(Service, ToBeIgnoredService);
        const newService = Injector.GetRequiredService(Service);
        expect(newService).toBeInstanceOf(ToBeAddedService);
    });
});

describe('TryAddScoped', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.TryAddScoped(type as any))
                    .toThrowError(ArgumentException);
            });
        });
    });

    describe('PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
        @Injectable()
        class Service { }

        const types = getSupportedImplementationTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.TryAddScoped(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('ServiceNotExist_ServiceWillBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }

        const context = Injector.Create()
        Injector.TryAddScoped(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service, context);
        expect(service).toBeInstanceOf(ToBeAddedService);
    });

    it('ServiceExist_ServiceWillNotBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class ToBeIgnoredService extends Service {
            rid = Math.random();
        }

        const context = Injector.Create()
        Injector.TryAddScoped(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service, context);
        expect(service).toBeInstanceOf(ToBeAddedService);

        Injector.TryAddScoped(Service, ToBeIgnoredService);
        const newService = Injector.GetRequiredService(Service, context);
        expect(newService).toBeInstanceOf(ToBeAddedService);
    });
});

describe('TryAddTransient', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.TryAddTransient(type as any))
                    .toThrowError(ArgumentException);
            });
        });
    });

    describe('PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
        @Injectable()
        class Service { }

        const types = getSupportedImplementationTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.TryAddTransient(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('ServiceNotExist_ServiceWillBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }

        Injector.TryAddTransient(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service);
        expect(service).toBeInstanceOf(ToBeAddedService);
    });

    it('ServiceExist_ServiceWillNotBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class ToBeIgnoredService extends Service {
            rid = Math.random();
        }

        Injector.TryAddTransient(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service);
        expect(service).toBeInstanceOf(ToBeAddedService);

        Injector.TryAddTransient(Service, ToBeIgnoredService);
        const newService = Injector.GetRequiredService(Service);
        expect(newService).toBeInstanceOf(ToBeAddedService);
    });
});
