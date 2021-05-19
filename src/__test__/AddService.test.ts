import { Context, Injector, ServiceLifetime, Injectable } from "../";

import {
    LifestyleMismatchException,
    ActivationFailedException,
    InvalidOperationException,
    ArgumentException
} from "../Exceptions";

class Service {
    id = Math.random() * Math.random();
}
class Implementation { }
describe('AddService_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.instance.AddService(type, Implementation, ServiceLifetime.Singleton))
                .toThrowError(ArgumentException);
        })
    });
});


describe('AddService_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const types = [{}, function () { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.instance.AddService(Service, type, ServiceLifetime.Singleton))
                .toThrowError(ArgumentException);
        })
    });
});


test('AddService_ServiceExist_InvalidOperationExceptionThrown', () => {

    Injector.instance.AddService(Service, null, ServiceLifetime.Singleton);

    expect(() => {
        Injector.instance.AddService(Service, null, ServiceLifetime.Singleton);
    })
        .toThrowError(InvalidOperationException);

});


test('AddService_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    Injector.instance.AddService(Service, null, ServiceLifetime.Singleton);

    const instance = Injector.Locate(Service);

    expect(instance).toBeInstanceOf(Service);
});

test('AddService_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    Injector.instance.AddService(Service, Implementation, ServiceLifetime.Singleton);

    const instance = Injector.Locate(Service);

    expect(instance).toBeInstanceOf(Implementation);
});

test('AddService_ServiceTypeAndImplementationFactory_ReturnedResultOfImplementationTypeReturned', () => {
    const factoryResult = new Implementation();
    Injector.instance.AddService(Service, () => factoryResult, ServiceLifetime.Singleton);

    const result = Injector.Locate(Service);

    expect(result).toBe(factoryResult);
});

test('AddService_InjectedServiceNotAdded_ActivationFailedExceptionThrown', () => {
    try {
        @Injectable()
        class InjectableService {
            constructor(
                private service: Service
            ) { }
        }
        Injector.AddSingleton(InjectableService);
        expect(true).toBeFalsy();
    } catch (error) {
        expect(Object.getPrototypeOf(error).constructor === ActivationFailedException).toBeTruthy();
    }

});

test('AddService_InjectedServiceAddedAfterServiceTypeHost_ActivationFailedExceptionThrown', () => {
    try {
        @Injectable()
        class InjectableService {
            constructor(
                private service: Service
            ) { }
        }
        Injector.AddSingleton(InjectableService);
        Injector.AddSingleton(Service);
        expect(true).toBeFalsy();
    } catch (error) {
        expect(Object.getPrototypeOf(error).constructor === ActivationFailedException).toBeTruthy();
    }

});

test('AddService_InjectTransientServiceInSingletonService_LifestyleMismatchExceptionThrown', () => {
    try {
        @Injectable()
        class InjectableService {
            constructor(
                private service: Service
            ) { }
        }
        Injector.AddTransient(Service);
        Injector.AddSingleton(InjectableService);
        expect(true).toBeFalsy();
    } catch (error) {
        expect(Object.getPrototypeOf(error).constructor === LifestyleMismatchException).toBeTruthy();
    }

});


afterEach(() => {
    Injector.instance.Remove(Implementation);
    Injector.instance.Remove(Service);
});

// Injector.AppendScoped(Service, () => {
    //     console.count('Called');
    //     return new Service1();
    // });
    // What should happen if AppendScoped called twice with same argument (check .netcore)
    // What should happen if Append{LifeTime} called with impl factory (check .netcore)
