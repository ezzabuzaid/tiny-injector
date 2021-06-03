import { Injector } from "../src/Injector";
import { AbstractServiceCollection, Injectable } from "../src";
import { ArgumentException } from "../src/Exceptions/ArgumentException";
import { LifestyleMismatchException } from "../src/Exceptions/LifestyleMismatchException";
import { ServiceCollection } from "../src/ServiceCollection";
@Injectable()
class Service {
    id = Math.random() * Math.random();
}

const services = Injector.Of(new ServiceCollection())

test('GetRequiredService_GetSingleton_ReturnSameInstanceOnSubsequentCalls', () => {
    services.AddSingleton(Service);

    const instance1 = services.GetRequiredService(Service);
    const instance2 = services.GetRequiredService(Service);
    const instance3 = services.GetRequiredService(Service);

    expect(instance1).toBe(instance2);
    expect(instance2).toBe(instance3);
    expect(instance1).toBe(instance3);
});

test('GetRequiredService_GetMultipleSingleton_ReturnSameInstanceOnSubsequentCalls', () => {
    @Injectable()
    class Service1 extends Service { }
    @Injectable()
    class Service2 extends Service { }

    services.AddSingleton(Service);
    services.AppendSingleton(Service, Service1);
    services.AppendSingleton(Service, Service2);

    const instances = services.GetRequiredService({
        serviceType: Service,
        multiple: true
    });
    const instances1 = services.GetRequiredService({
        serviceType: Service,
        multiple: true
    });

    [Service, Service1, Service2].forEach((serviceType, index) => {
        expect(instances[index]).toBeInstanceOf(serviceType);
    });

    expect(instances.every((instance, index) => instances1[index] === instance)).toBeTruthy();
});

test('GetRequiredService_GetTransient_ReturnNewInstanceOnSubsequentCalls', () => {
    services.AddTransient(Service);

    const instance1 = services.GetRequiredService(Service);
    const instance2 = services.GetRequiredService(Service);

    expect(instance1 !== instance2);
});

test('GetRequiredService_GetMultipleTransient_ReturnNewInstanceOnSubsequentCalls', () => {
    @Injectable()
    class Service1 extends Service { }

    services.AddTransient(Service);
    services.AppendTransient(Service, Service1);

    const instances = services.GetRequiredService({
        serviceType: Service,
        multiple: true
    });
    const instances1 = services.GetRequiredService({
        serviceType: Service,
        multiple: true
    });

    [Service, Service1].forEach((serviceType, index) => {
        expect(instances[index]).toBeInstanceOf(serviceType);
    });
    expect(instances.every((instance, index) => instances1[index] !== instance)).toBeTruthy();
    expect(instances.slice(0).reverse().every((instance, index) => instances1[index] !== instance)).toBeTruthy();

});

test('GetRequiredService_GetScoped_ReturnSameInstanceForSameContextInSubsequentCalls', () => {
    @Injectable()
    class Service1 extends Service { }

    services.AddScoped(Service);
    services.AddScoped(Service1);

    const context = services.Create();

    const instance1 = services.GetRequiredService(Service, context);
    const instance2 = services.GetRequiredService(Service, context);
    const instance3 = services.GetRequiredService(Service, context);
    const instance11 = services.GetRequiredService(Service1, context);
    const instance12 = services.GetRequiredService(Service1, context);

    expect(instance1 === instance2).toBeTruthy();
    expect(instance2 === instance1).toBeTruthy();
    expect(instance2 === instance3).toBeTruthy();

    expect(instance11 === instance12).toBeTruthy();
});

test('GetRequiredService_GetScoped_ReturnDifferentInstanceForDifferentContext', () => {
    @Injectable()
    class ScopedService {
        id = Math.random() * Math.random();
    }

    services.AddScoped(ScopedService);

    const context1 = services.Create();
    const context2 = services.Create();

    const instanceContext1 = services.GetRequiredService(ScopedService, context1);
    const instanceContext2 = services.GetRequiredService(ScopedService, context2);
    expect(instanceContext1 !== instanceContext2).toBeTruthy();
});

test('GetRequiredService_GetMultipleScoped_ReturnSameInstanceForSameContextOnSubsequentCallsWith', () => {
    @Injectable()
    class Service1 extends Service { }

    services.AddScoped(Service);
    services.AppendScoped(Service, Service1);

    const context = services.Create();

    const instances = services.GetRequiredService({
        serviceType: Service,
        multiple: true,
        context: context
    });
    const instances1 = services.GetRequiredService({
        serviceType: Service,
        multiple: true,
        context: context
    });

    [Service, Service1].forEach((serviceType, index) => {
        expect(instances[index]).toBeInstanceOf(serviceType);
    });
    expect(instances.every((instance, index) => instances1[index] === instance)).toBeTruthy();
});


test('GetRequiredService_GetScopedWithoutContext_ArgumentExceptionThrown', () => {
    services.AddScoped(Service);

    expect(() => {
        services.GetRequiredService(Service);
    })
        .toThrowError(ArgumentException);
});

test('GetRequiredService_GetScopedInTransientServiceWithoutContext_LifestyleMismatchExceptionThrown', () => {
    @Injectable()
    class InjectableService {
        constructor(
            private service: Service
        ) { }
    }

    services.AddScoped(Service);
    services.AddTransient(InjectableService);

    expect(() => {
        services.GetRequiredService(InjectableService);
    })
        .toThrowError(LifestyleMismatchException);
});

afterEach(() => {
    services.Remove(Service);
});
