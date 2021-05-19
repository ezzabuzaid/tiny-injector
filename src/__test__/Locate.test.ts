import { ArgumentException } from "../Exceptions/ArgumentException";
import { LifestyleMismatchException } from "../Exceptions/LifestyleMismatchException";
import { Context, Injectable, Injector, ServiceLifetime } from "../";
@Injectable()
class Service {
    id = Math.random() * Math.random();
}

@Injectable()
class Implementation { }

test('Locate_LocateSingleton_ReturnSameInstanceOnSubsequentCalls', () => {
    Injector.AddSingleton(Service);

    const instance1 = Injector.Locate(Service);
    const instance2 = Injector.Locate(Service);
    const instance3 = Injector.Locate(Service);

    expect(instance1).toBe(instance2);
    expect(instance2).toBe(instance3);
    expect(instance1).toBe(instance3);
});

test('Locate_LocateTransient_ReturnNewInstanceOnSubsequentCalls', () => {
    Injector.AddTransient(Service);

    const instance1 = Injector.Locate(Service);
    const instance2 = Injector.Locate(Service);

    expect(instance1 !== instance2);
});

test('Locate_LocateMultipleSingleton_ReturnSameInstanceOnSubsequentCalls', () => {
    class Service1 extends Service { }
    class Service2 extends Service { }
    Injector.AddSingleton(Service);
    Injector.AppendSingleton(Service, Service1);
    Injector.AppendSingleton(Service, Service2);

    const instances = Injector.Locate({
        serviceType: Service,
        multiple: true
    });
    const instances1 = Injector.Locate({
        serviceType: Service,
        multiple: true
    });

    [Service, Service1, Service2].forEach((serviceType, index) => {
        expect(instances[index]).toBeInstanceOf(serviceType);
    });

    expect(instances.every((instance, index) => instances1[index] === instance)).toBeTruthy();
});

test('Locate_LocateMultipleTransient_ReturnNewInstanceOnSubsequentCalls', () => {
    class Service1 extends Service { }
    Injector.AddTransient(Service);
    Injector.AppendTransient(Service, Service1);

    const instances = Injector.Locate({
        serviceType: Service,
        multiple: true
    });
    const instances1 = Injector.Locate({
        serviceType: Service,
        multiple: true
    });

    [Service, Service1].forEach((serviceType, index) => {
        expect(instances[index]).toBeInstanceOf(serviceType);
    });
    expect(instances.every((instance, index) => instances1[index] !== instance)).toBeTruthy();

});

test('Locate_LocateMultipleScoped_ReturnSameInstanceForSameContextOnSubsequentCallsWith', () => {
    class Service1 extends Service { }
    Injector.AddScoped(Service);
    Injector.AppendScoped(Service, Service1);

    const context = Injector.Create();

    const instances = Injector.Locate({
        serviceType: Service,
        multiple: true,
        context: context
    });
    const instances1 = Injector.Locate({
        serviceType: Service,
        multiple: true,
        context: context
    });

    [Service, Service1].forEach((serviceType, index) => {
        expect(instances[index]).toBeInstanceOf(serviceType);
    });
    expect(instances.every((instance, index) => instances1[index] === instance)).toBeTruthy();
});

test('Locate_LocateScoped_ReturnSameInstanceForSameContextInSubsequentCalls', () => {
    class Service1 extends Service { }
    Injector.AddScoped(Service);
    Injector.AddScoped(Service1);

    const context = Injector.Create();

    const instance1 = Injector.Locate(Service, context);
    const instance2 = Injector.Locate(Service, context);
    const instance3 = Injector.Locate(Service, context);
    const instance11 = Injector.Locate(Service1, context);
    const instance12 = Injector.Locate(Service1, context);

    expect(instance1 === instance2).toBeTruthy();
    expect(instance2 === instance1).toBeTruthy();
    expect(instance2 === instance3).toBeTruthy();
    expect(instance11 === instance12).toBeTruthy();
});

test('Locate_LocateScoped_ReturnDifferentInstanceForDifferentContext', () => {
    Injector.AddScoped(Service);

    const context1 = Injector.Create();
    const context2 = Injector.Create();

    const instanceContext1 = Injector.Locate(Service, context1);
    const instanceContext2 = Injector.Locate(Service, context2);
    expect(instanceContext1 !== instanceContext2).toBeTruthy();
});

test('Locate_LocateScopedWithoutContext_ArgumentExceptionThrown', () => {
    Injector.AddScoped(Service);

    expect(() => {
        Injector.Locate(Service);
    })
        .toThrowError(ArgumentException);
});

test('Locate_LocateScopedInTransientServiceWithoutContext_LifestyleMismatchExceptionThrown', () => {
    @Injectable()
    class InjectableService {
        constructor(
            private service: Service
        ) { }
    }

    Injector.AddScoped(Service);
    Injector.AddTransient(InjectableService);

    expect(() => {
        Injector.Locate(InjectableService);
    })
        .toThrowError(LifestyleMismatchException);
});

test('Locate_LocateScopedInTransientService_LifestyleMismatchExceptionThrown', () => {
    @Injectable()
    class InjectableService {
        constructor(
            private service: Service
        ) { }
    }

    Injector.AddScoped(Service);
    Injector.AddTransient(InjectableService);

    expect(() => {
        Injector.Locate(InjectableService);
    })
        .toThrowError(LifestyleMismatchException);
});

afterEach(() => {
    Injector.instance.Remove(Implementation);
    Injector.instance.Remove(Service);
});
