import { ArgumentException, Injectable, Injector, ServiceNotFoundException } from "../src";
import { getSupportedImplementationTypeTypes, getSupportedServiceTypeTypes } from "./utils";

describe('ReplaceSingleton', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.ReplaceSingleton(type as any))
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
                expect(() => Injector.ReplaceSingleton(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('ServiceNotExist_ServiceNotFoundExceptionThrown', () => {
        @Injectable()
        class Service { }

        expect(() => {
            Injector.ReplaceSingleton(Service);
        }).toThrowErrorOfType(ServiceNotFoundException);
    });

    it('ServiceExist_ServiceWillBeReplaced', () => {

        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class ToBeReplacedService extends Service {
            rid = Math.random();
        }


        Injector.AddSingleton(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service);
        expect(service).toBeInstanceOf(ToBeAddedService);

        Injector.ReplaceSingleton(Service, ToBeReplacedService);
        const newService = Injector.GetRequiredService(Service);
        expect(newService).toBeInstanceOf(ToBeReplacedService);
    });
});

describe('ReplaceScoped', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.ReplaceScoped(type as any))
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
                expect(() => Injector.ReplaceScoped(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('ServiceNotExist_ServiceNotFoundExceptionThrown', () => {
        @Injectable()
        class Service { }

        expect(() => {
            Injector.ReplaceScoped(Service);
        }).toThrowErrorOfType(ServiceNotFoundException);
    });

    it('ServiceExist_ServiceWillBeReplaced', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class ToBeReplacedService extends Service {
            rid = Math.random();
        }

        const context = Injector.Create();

        Injector.AddScoped(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service, context);
        expect(service).toBeInstanceOf(ToBeAddedService);

        Injector.ReplaceScoped(Service, ToBeReplacedService);
        const newService = Injector.GetRequiredService(Service, context);
        expect(newService).toBeInstanceOf(ToBeReplacedService);
    });
});

describe('ReplaceTransient', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.ReplaceTransient(type as any))
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
                expect(() => Injector.ReplaceTransient(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('ServiceNotExist_ServiceNotFoundExceptionThrown', () => {
        @Injectable()
        class Service { }

        expect(() => {
            Injector.ReplaceTransient(Service);
        }).toThrowErrorOfType(ServiceNotFoundException);
    });

    it('ServiceExist_ServiceWillBeReplaced', () => {

        @Injectable()
        class Service {
            id = Math.random();
        }
        @Injectable()
        class ToBeAddedService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class ToBeReplacedService extends Service {
            rid = Math.random();
        }


        Injector.AddTransient(Service, ToBeAddedService);
        const service = Injector.GetRequiredService(Service);
        expect(service).toBeInstanceOf(ToBeAddedService);

        Injector.ReplaceTransient(Service, ToBeReplacedService);
        const newService = Injector.GetRequiredService(Service);
        expect(newService).toBeInstanceOf(ToBeReplacedService);
    });
});

// xit('AddService throws error after calling ReplaceService');