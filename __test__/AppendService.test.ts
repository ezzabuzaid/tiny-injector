import { ArgumentException, Injectable, Injector } from "../src";
import { getSupportedImplementationTypeTypes, getSupportedServiceTypeTypes } from "./utils";

describe('AppendSingleton', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${type}`, () => {
                expect(() => Injector.AppendSingleton(type as any))
                    .toThrowError(ArgumentException);
            });
        });
    });

    describe('PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
        @Injectable()
        class Service { }

        const types = getSupportedImplementationTypeTypes();
        types.forEach((type) => {
            test(`${type}`, () => {
                expect(() => Injector.AppendSingleton(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('AddMultipleServices_ServicesWillBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }

        @Injectable()
        class FirstService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class SecondService extends Service {
            aid = Math.random();
        }

        Injector.AppendSingleton(Service);
        Injector.AppendSingleton(Service, FirstService);
        Injector.AppendSingleton(Service, SecondService);
        const services = Injector.GetServices(Service);
        expect(services[0]).toBeInstanceOf(Service);
        expect(services[1]).toBeInstanceOf(FirstService);
        expect(services[2]).toBeInstanceOf(SecondService);
    });

    it('RegisterSameTypeMultipleTimes_RetrunsDifferentInstancesOfTheSameImplementationType', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }

        Injector.AppendSingleton(Service);
        Injector.AppendSingleton(Service);
        Injector.AppendSingleton(Service);
        const services = Injector.GetServices(Service);
        expect(services[0]).toBeInstanceOf(Service);
        expect(services[1]).toBeInstanceOf(Service);
        expect(services[2]).toBeInstanceOf(Service);
    });
});

describe('AppendTransient', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${type}`, () => {
                expect(() => Injector.AppendTransient(type as any))
                    .toThrowError(ArgumentException);
            });
        });
    });

    describe('PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
        @Injectable()
        class Service { }

        const types = getSupportedImplementationTypeTypes();
        types.forEach((type) => {
            test(`${type}`, () => {
                expect(() => Injector.AppendTransient(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('AddMultipleServices_ServicesWillBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }

        @Injectable()
        class FirstService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class SecondService extends Service {
            aid = Math.random();
        }

        Injector.AppendTransient(Service);
        Injector.AppendTransient(Service, FirstService);
        Injector.AppendTransient(Service, SecondService);
        const services = Injector.GetServices(Service);
        expect(services[0]).toBeInstanceOf(Service);
        expect(services[1]).toBeInstanceOf(FirstService);
        expect(services[2]).toBeInstanceOf(SecondService);
    });
});

describe('AppendScoped', () => {
    describe('PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
        const types = getSupportedServiceTypeTypes();
        types.forEach((type) => {
            test(`${type}`, () => {
                expect(() => Injector.AppendTransient(type as any))
                    .toThrowError(ArgumentException);
            });
        });
    });

    describe('PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
        @Injectable()
        class Service { }

        const types = getSupportedImplementationTypeTypes();
        types.forEach((type) => {
            test(`${type}`, () => {
                expect(() => Injector.AppendTransient(Service, type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });

    it('AddMultipleServices_ServicesWillBeAdded', () => {
        @Injectable()
        class Service {
            id = Math.random();
        }

        @Injectable()
        class FirstService extends Service {
            aid = Math.random();
        }
        @Injectable()
        class SecondService extends Service {
            aid = Math.random();
        }

        const context = Injector.Create();
        Injector.AppendScoped(Service);
        Injector.AppendScoped(Service, FirstService);
        Injector.AppendScoped(Service, SecondService);
        const services = Injector.GetServices(Service, context);
        expect(services[0]).toBeInstanceOf(Service);
        expect(services[1]).toBeInstanceOf(FirstService);
        expect(services[2]).toBeInstanceOf(SecondService);
    });
});

