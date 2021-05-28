import { Inject, Injectable, InjectionToken, Injector, ServiceLifetime } from "../src";

test('Inject_MultipleServicesWithArrayType_ReturnArrayOfServices', () => {
    @Injectable()
    class Service { }

    @Injectable()
    class Service1 extends Service { }
    @Injectable()
    class Service2 extends Service { }

    @Injectable()
    class Client {
        constructor(
            @Inject(Service) public services: Service[],
            @Inject(Service) public services1: Service[],
        ) { }
    }

    Injector.AppendSingleton(Service);
    Injector.AppendSingleton(Service, Service1);
    Injector.AppendSingleton(Service, Service2);
    Injector.AppendSingleton(Client);

    const client = Injector.Locate(Client);

    [Service, Service1, Service2].forEach((serviceType, index) => {
        expect(client.services[index]).toBeInstanceOf(serviceType);
    });

    expect(client.services.every((instance, index) => client.services1[index] === instance)).toBeTruthy();

});

test('Inject_MultipleServicesWithNonArrayType_ReturnLastAddedService', () => {
    @Injectable()
    class Service { }

    @Injectable()
    class Service1 extends Service { }
    @Injectable()
    class ServiceToBeAddedLast extends Service { }

    @Injectable()
    class Client {
        constructor(
            @Inject(Service) public services: {},
        ) { }
    }

    Injector.AppendSingleton(Service);
    Injector.AppendSingleton(Service, Service1);
    Injector.AppendSingleton(Service, ServiceToBeAddedLast);
    Injector.AppendSingleton(Client);

    const client = Injector.Locate(Client);

    expect(client.services).toBeInstanceOf(ServiceToBeAddedLast);

});

test('Inject_InjectionToken_ReturnImplementationFactoryReturnedValue', () => {
    const tokenValue = Math.random();
    const TOKEN_UNDER_TEST = new InjectionToken<number>('UnderTest', {
        lifetime: ServiceLifetime.Transient,
        implementationFactory: () => tokenValue
    });

    @Injectable()
    class Client {
        constructor(
            @Inject(TOKEN_UNDER_TEST) public tokenUnderTest: number,
        ) { }
    }

    Injector.AppendSingleton(Client);

    const client = Injector.Locate(Client);

    expect(client.tokenUnderTest).toEqual(tokenValue);

});
