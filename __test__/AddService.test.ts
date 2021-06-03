import { AbstractServiceCollection, Injectable } from "../src";
import { ArgumentException, LifestyleMismatchException, ServiceExistException } from "../src/Exceptions";
import { isTypeOf } from "../src/Utils";
import { Injector } from "../src/Injector";
import { ServiceCollection } from "../src/ServiceCollection";

const services = Injector.Of(new ServiceCollection());

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
            expect(() => services.AddSingleton(type as any, Implementation))
                .toThrowError(ArgumentException);
        });
    });
});

describe('AddScoped_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddScoped(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddTransient_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddTransient(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddSingleton_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const types = [{}, function () { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddSingleton(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddScoped_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const types = [{}, function () { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddScoped(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddTransient_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const types = [{}, function () { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddTransient(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

test('AddSingleton_ServiceExist_ServiceExistExceptionThrown', () => {
    try {
        services.AddSingleton(Service);
        services.AddSingleton(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddTransient_ServiceExist_ServiceExistExceptionThrown', () => {
    try {
        services.AddTransient(Service);
        services.AddTransient(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddScoped_ServiceExist_ServiceExistExceptionThrown', () => {
    try {
        services.AddScoped(Service);
        services.AddScoped(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddSingleton_ServiceExistWithTransientLifetime_ServiceExistExceptionThrown', () => {
    try {
        services.AddSingleton(Service);
        services.AddTransient(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddSingleton_ServiceExistWithScopedLifetime_ServiceExistExceptionThrown', () => {
    try {
        services.AddSingleton(Service);
        services.AddScoped(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddTransient_ServiceExistWithScopedLifetime_ServiceExistExceptionThrown', () => {
    try {
        services.AddTransient(Service);
        services.AddScoped(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddTransient_ServiceExistWithSingletonLifetime_ServiceExistExceptionThrown', () => {
    try {
        services.AddTransient(Service);
        services.AddSingleton(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddScoped_ServiceExistWithSingletonLifetime_ServiceExistExceptionThrown', () => {
    try {
        services.AddScoped(Service);
        services.AddSingleton(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddScoped_ServiceExistWithTransientLifetime_ServiceExistExceptionThrown', () => {
    try {
        services.AddScoped(Service);
        services.AddTransient(Service);
        expect(false).toBeTruthy();
    } catch (error) {
        expect(isTypeOf(error, ServiceExistException)).toBeTruthy();
    }
});

test('AddSingleton_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    services.AddSingleton(Service);

    const instance = services.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Service);
});

test('AddTransient_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    services.AddTransient(Service);

    const instance = services.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Service);
});

test('AddScoped_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    services.AddScoped(Service);
    const context = services.Create();

    const instance = services.GetRequiredService(Service, context);

    expect(instance).toBeInstanceOf(Service);
});

test('AddSingleton_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    services.AddSingleton(Service, Implementation);

    const instance = services.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Implementation);
});

test('AddTransient_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    services.AddTransient(Service, Implementation);

    const instance = services.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Implementation);
});
test('AddScoped_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    services.AddScoped(Service, Implementation);
    const context = services.Create();

    const instance = services.GetRequiredService(Service, context);

    expect(instance).toBeInstanceOf(Implementation);
});

test('AddSingleton_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const factoryResult = new Implementation();
    services.AddSingleton(Service, () => factoryResult);

    const result = services.GetRequiredService(Service);

    expect(result).toBe(factoryResult);
});
test('AddTransient_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const factoryResult = new Implementation();
    services.AddTransient(Service, () => factoryResult);

    const result = services.GetRequiredService(Service);

    expect(result).toBe(factoryResult);
});

test('AddScoped_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const factoryResult = new Implementation();
    services.AddScoped(Service, () => factoryResult);
    const context = services.Create();

    const result = services.GetRequiredService(Service, context);

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
        services.AddSingleton(InjectableService);
        services.AddTransient(Service);
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
        services.AddScoped(Service);
        services.AddSingleton(InjectableService);
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

    services.AddSingleton(ParentService);
    services.AddSingleton(ToBeInjectedService);
    const parentService = services.GetRequiredService(ParentService)
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

        services.AddSingleton(ParentService);
        services.AddScoped(ToBeInjectedService);

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

        services.AddSingleton(ParentService);
        services.AddTransient(ToBeInjectedService);

        expect(true).toBeFalsy();
    } catch (error) {
        expect(Object.getPrototypeOf(error).constructor === LifestyleMismatchException).toBeTruthy();
    }
});


afterEach(() => {
    services.Remove(Service);
    services.Remove(Implementation);
});