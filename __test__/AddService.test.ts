import { AbstractServiceCollection, Injectable, Injector } from "../src";
import { ArgumentException, LifestyleMismatchException, ServiceExistException } from "../src/Exceptions";
import { isTypeOf } from "../src/Utils";


@Injectable()
class Service {
    id = Math.random() * Math.random();
}
@Injectable()
class Implementation implements Service {
    id = Math.random() * Math.random();
}

describe('AddSingleton_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.AddSingleton(type as any, Implementation))
                .toThrowError(ArgumentException);
        });
    });
});
describe('AddScoped_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.AddScoped(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
})
describe('AddTransient_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.AddTransient(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddSingleton_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const types = [{}, function () { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.AddSingleton(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddScoped_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const types = [{}, function () { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.AddScoped(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddTransient_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const types = [{}, function () { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.AddTransient(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

test('AddSingleton_ServiceExist_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddSingleton(Service);
        Injector.AddSingleton(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddTransient_ServiceExist_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddTransient(Service);
        Injector.AddTransient(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddScoped_ServiceExist_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddScoped(Service);
        Injector.AddScoped(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddSingleton_ServiceExistWithTransientLifetime_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddSingleton(Service);
        Injector.AddTransient(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddSingleton_ServiceExistWithScopedLifetime_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddSingleton(Service);
        Injector.AddScoped(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddTransient_ServiceExistWithScopedLifetime_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddTransient(Service);
        Injector.AddScoped(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddTransient_ServiceExistWithSingletonLifetime_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddTransient(Service);
        Injector.AddSingleton(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddScoped_ServiceExistWithSingletonLifetime_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddScoped(Service);
        Injector.AddSingleton(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});
test('AddScoped_ServiceExistWithTransientLifetime_ServiceExistExceptionThrown', () => {
    try {
        Injector.AddScoped(Service);
        Injector.AddTransient(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddSingleton_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    Injector.AddSingleton(Service);

    const instance = Injector.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Service);
});
test('AddTransient_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    Injector.AddTransient(Service);

    const instance = Injector.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Service);
});
test('AddScoped_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    Injector.AddScoped(Service);
    const context = Injector.Create();

    const instance = Injector.GetRequiredService(Service, context);

    expect(instance).toBeInstanceOf(Service);
});

test('AddSingleton_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    Injector.AddSingleton(Service, Implementation);

    const instance = Injector.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Implementation);
});
test('AddTransient_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    Injector.AddTransient(Service, Implementation);

    const instance = Injector.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Implementation);
});
test('AddScoped_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    Injector.AddScoped(Service, Implementation);
    const context = Injector.Create();

    const instance = Injector.GetRequiredService(Service, context);

    expect(instance).toBeInstanceOf(Implementation);
});

test('AddSingleton_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const factoryResult = new Implementation();
    Injector.AddSingleton(Service, () => factoryResult);

    const result = Injector.GetRequiredService(Service);

    expect(result).toBe(factoryResult);
});
test('AddTransient_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const factoryResult = new Implementation();
    Injector.AddTransient(Service, () => factoryResult);

    const result = Injector.GetRequiredService(Service);

    expect(result).toBe(factoryResult);
});
test('AddScoped_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const factoryResult = new Implementation();
    Injector.AddScoped(Service, () => factoryResult);
    const context = Injector.Create();

    const result = Injector.GetRequiredService(Service, context);

    expect(result).toBe(factoryResult);
});

test('AddSingleton_AddSingletonServiceThatInjectTransientService_LifestyleMismatchExceptionThrown', () => {
    try {
        @Injectable()
        class InjectableService {
            constructor(
                private service: Service
            ) { }
        }
        Injector.AddSingleton(InjectableService);
        Injector.AddTransient(Service);
        expect(true).toBeFalsy();
    } catch (error) {
        expect(isTypeOf(error, LifestyleMismatchException)).toBeTruthy();
    }
});

test('AddSingleton_AddSingletonServiceThatInjectScopedService_LifestyleMismatchExceptionThrown', () => {
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
    const parentService = Injector.GetRequiredService(ParentService)
    expect(parentService).toBeInstanceOf(ParentService);
    expect(parentService.toBeInjectedService).toBeInstanceOf(ToBeInjectedService);
});

test('AddSingleton_InjectScopedDelegatedServiceInSingleton_LifestyleMismatchExceptionThrown', () => {
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
        expect(isTypeOf(error, LifestyleMismatchException)).toBeTruthy();
    }
});

test('AddSingleton_InjectTransientDelegatedServiceInSingleton_LifestyleMismatchExceptionThrown', () => {
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
    Injector.GetRequiredService(AbstractServiceCollection).Remove(Implementation);
    Injector.GetRequiredService(AbstractServiceCollection).Remove(Service);
});

