import { Injectable } from "../src";
import { ArgumentException, LifestyleMismatchException, ServiceExistException } from "../src/Exceptions";
import { Injector } from "../src/Injector";
import { ServiceCollection } from "../src/ServiceCollection";
import { getSupportedImplementationTypeTypes, getSupportedServiceTypeTypes } from "./utils";

const services = Injector.Of(new ServiceCollection());

function setup() {
    @Injectable()
    class Service {
        id = Math.random() * Math.random();
    }
    @Injectable()
    class Implementation implements Service {
        id = Math.random() * Math.random();
    }
    return { Service, Implementation }
}

describe('AddSingleton_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const { Implementation, Service } = setup();
    const types = getSupportedServiceTypeTypes();
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddSingleton(type as any, Implementation))
                .toThrowError(ArgumentException);
        });
    });
});

describe('AddScoped_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const { Implementation, Service } = setup();
    const types = getSupportedServiceTypeTypes();
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddScoped(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddTransient_PrimitiveTypeAsServiceType_ArgumentExceptionThrown', () => {
    const { Implementation, Service } = setup();
    const types = getSupportedServiceTypeTypes();
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddTransient(type as any, Implementation))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddSingleton_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const { Implementation, Service } = setup();
    const types = getSupportedImplementationTypeTypes();
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddSingleton(Service, type as any))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddScoped_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const { Implementation, Service } = setup();
    const types = getSupportedImplementationTypeTypes();
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddScoped(Service, type as any))
                .toThrowError(ArgumentException);
        })
    });
});

describe('AddTransient_PrimitiveTypeAsImplementationType_ArgumentExceptionThrown', () => {
    const { Implementation, Service } = setup();
    const types = getSupportedImplementationTypeTypes();
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => services.AddTransient(Service, type as any))
                .toThrowError(ArgumentException);
        })
    });
});

test('AddSingleton_ServiceExist_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddSingleton(Service);
        services.AddSingleton(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddTransient_ServiceExist_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddTransient(Service);
        services.AddTransient(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddScoped_ServiceExist_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddScoped(Service);
        services.AddScoped(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddSingleton_ServiceExistWithTransientLifetime_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddSingleton(Service);
        services.AddTransient(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddSingleton_ServiceExistWithScopedLifetime_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddSingleton(Service);
        services.AddScoped(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddTransient_ServiceExistWithScopedLifetime_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddTransient(Service);
        services.AddScoped(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddTransient_ServiceExistWithSingletonLifetime_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddTransient(Service);
        services.AddSingleton(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddScoped_ServiceExistWithSingletonLifetime_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddScoped(Service);
        services.AddSingleton(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddScoped_ServiceExistWithTransientLifetime_ServiceExistExceptionThrown', () => {
    const { Implementation, Service } = setup();
    expect(() => {
        services.AddScoped(Service);
        services.AddTransient(Service);
    }).toThrowErrorOfType(ServiceExistException);
});

test('AddSingleton_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    const { Implementation, Service } = setup();
    services.AddSingleton(Service);

    const instance = services.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Service);
});

test('AddTransient_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    const { Implementation, Service } = setup();
    services.AddTransient(Service);

    const instance = services.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Service);
});

test('AddScoped_ServiceTypeOnly_InstanceOfServiceTypeReturned', () => {
    const { Implementation, Service } = setup();
    services.AddScoped(Service);
    const context = services.Create();

    const instance = services.GetRequiredService(Service, context);

    expect(instance).toBeInstanceOf(Service);
});

test('AddSingleton_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    const { Implementation, Service } = setup();
    services.AddSingleton(Service, Implementation);

    const instance = services.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Implementation);
});

test('AddTransient_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    const { Implementation, Service } = setup();
    services.AddTransient(Service, Implementation);

    const instance = services.GetRequiredService(Service);

    expect(instance).toBeInstanceOf(Implementation);
});
test('AddScoped_ServiceTypeAndImplementationType_InstanceOfImplementationTypeReturned', () => {
    const { Implementation, Service } = setup();
    services.AddScoped(Service, Implementation);
    const context = services.Create();

    const instance = services.GetRequiredService(Service, context);

    expect(instance).toBeInstanceOf(Implementation);
});

test('AddSingleton_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const { Implementation, Service } = setup();
    const factoryResult = new Implementation();
    services.AddSingleton(Service, () => factoryResult);

    const result = services.GetRequiredService(Service);

    expect(result).toBe(factoryResult);
});
test('AddTransient_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const { Implementation, Service } = setup();
    const factoryResult = new Implementation();
    services.AddTransient(Service, () => factoryResult);

    const result = services.GetRequiredService(Service);

    expect(result).toBe(factoryResult);
});

test('AddScoped_ServiceTypeAndImplementationFactory_ReturnResultOfImplementationTypeReturned', () => {
    const { Implementation, Service } = setup();
    const factoryResult = new Implementation();
    services.AddScoped(Service, () => factoryResult);
    const context = services.Create();

    const result = services.GetRequiredService(Service, context);

    expect(result).toBe(factoryResult);
});

test('AddSingleton_AddSingletonServiceThatInjectTransientService_LifestyleMismatchExceptionThrown', () => {
    @Injectable()
    class Service {
        id = Math.random() * Math.random();
    }
    expect(() => {
        @Injectable()
        class InjectableService {
            constructor(
                private service: Service
            ) { }
        }
        services.AddSingleton(InjectableService);
        services.AddTransient(Service);
    }).toThrowErrorOfType(LifestyleMismatchException);
});

test('AddSingleton_AddSingletonServiceThatInjectScopedService_LifestyleMismatchExceptionThrown', () => {
    @Injectable()
    class Service {
        id = Math.random() * Math.random();
    }
    expect(() => {
        @Injectable()
        class InjectableService {
            constructor(
                private service: Service
            ) { }
        }
        services.AddScoped(Service);
        services.AddSingleton(InjectableService);
    }).toThrowErrorOfType(LifestyleMismatchException);
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
    expect(() => {
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
    }).toThrowErrorOfType(LifestyleMismatchException);
});

test('AddSingleton_InjectTransientDelegatedServiceInSingleton_LifestyleMismatchExceptionThrown', () => {
    expect(() => {
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
    }).toThrowErrorOfType(LifestyleMismatchException);
});
