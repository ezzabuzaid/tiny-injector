import { Context, Injector, ServiceLifetime, Injectable } from "../src";

import {
    LifestyleMismatchException,
    ActivationFailedException,
    InvalidOperationException,
    ArgumentException
} from "../src/Exceptions";

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

test('AddService_ServiceExistWithDifferentLifetime_InvalidOperationExceptionThrown', () => {

    Injector.instance.AddService(Service, null, ServiceLifetime.Singleton);

    expect(() => {
        Injector.instance.AddService(Service, null, ServiceLifetime.Transient);
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

test('AddService_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const factoryResult = new Implementation();
    Injector.instance.AddService(Service, () => factoryResult, ServiceLifetime.Singleton);

    const result = Injector.Locate(Service);

    expect(result).toBe(factoryResult);
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
test('AddService_InjectScopedServiceInSingletonService_LifestyleMismatchExceptionThrown', () => {
    try {
        @Injectable()
        class InjectableService {
            constructor(
                private service: Service
            ) { }
        }
        Injector.AddScoped(Service);
        Injector.AddSingleton(InjectableService);
        expect(true).toBeFalsy();
    } catch (error) {
        expect(Object.getPrototypeOf(error).constructor === LifestyleMismatchException).toBeTruthy();
    }
});

test('AddService_InjectedServicesNotAddedYet_InjectedServicesToBeDelegated', () => {
    @Injectable()
    class ToBeInjectedService {
        constructor() { }
    }

    @Injectable()
    class ParentService {
        constructor(
            public toBeInjectedService: ToBeInjectedService
        ) { }
    }

    Injector.AddSingleton(ParentService);
    Injector.AddSingleton(ToBeInjectedService);
    const parentService = Injector.Locate(ParentService)
    expect(parentService).toBeInstanceOf(ParentService);
    expect(parentService.toBeInjectedService).toBeInstanceOf(ToBeInjectedService);
});

test('AddService_InjectScopedDelegatedServiceInSingleton_LifestyleMismatchExceptionThrown', () => {
    try {
        @Injectable()
        class ToBeInjectedService {
            constructor() { }
        }

        @Injectable()
        class ParentService {
            constructor(
                public toBeInjectedService: ToBeInjectedService
            ) { }
        }

        Injector.AddSingleton(ParentService);
        Injector.AddScoped(ToBeInjectedService);

        expect(true).toBeFalsy();
    } catch (error) {
        expect(Object.getPrototypeOf(error).constructor === LifestyleMismatchException).toBeTruthy();
    }
});

test('AddService_InjectTransientDelegatedServiceInSingleton_LifestyleMismatchExceptionThrown', () => {
    try {
        @Injectable()
        class ToBeInjectedService {
            constructor() { }
        }

        @Injectable()
        class ParentService {
            constructor(
                public toBeInjectedService: ToBeInjectedService
            ) { }
        }

        Injector.AddSingleton(ParentService);
        Injector.AddTransient(ToBeInjectedService);

        expect(true).toBeFalsy();
    } catch (error) {
        expect(Object.getPrototypeOf(error).constructor === LifestyleMismatchException).toBeTruthy();
    }
});

afterEach(() => {
    Injector.instance.Remove(Implementation);
    Injector.instance.Remove(Service);
});



test.skip('AddService_InjectedServiceNotAdded_ActivationFailedExceptionThrown', () => {
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


test.skip('AddService_InjectedServiceAddedAfterServiceTypeHost_ActivationFailedExceptionThrown___HasBeenModified to deletgate the addition', () => {
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

// Injector.AppendScoped(Service, () => {
    //     console.count('Called');
    //     return new Service1();
    // });
    // What should happen if AppendScoped called twice with same argument (check .netcore)
    // What should happen if Append{LifeTime} called with impl factory (check .netcore)
