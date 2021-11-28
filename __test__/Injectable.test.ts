import { ArgumentException, Injectable, Injector, ServiceLifetime } from "../src/";
import RootServiceCollection from "../src/RootServiceCollection";
import { ServiceCollection } from "../src/ServiceCollection";
import './utils';

describe('Injectable', () => {
    test.todo('PrimitiveTypeAsServiceType_ArgumentExceptionThrown');
    test('NonRootStringAsProvidedIn_ArgumentExceptionThrown', () => {
        expect(() => {
            @Injectable({
                provideIn: randomString() as any,
                lifetime: ServiceLifetime.Singleton
            })
            class Service { }
        }).toThrowErrorOfType(ArgumentException)
    });
    test('ProvidedInNotOfTypeAbstractServiceCollection_ArgumentExceptionThrown', () => {
        expect(() => {
            @Injectable({
                provideIn: class { } as any,
                lifetime: ServiceLifetime.Singleton
            })
            class Service { }
        }).toThrowErrorOfType(ArgumentException)
    });
    test('RootAsProvidedIn_UseRootServiceCollection', () => {
        @Injectable({
            provideIn: 'root',
            lifetime: ServiceLifetime.Singleton
        })
        class Service { }

        const service = Injector.Of(RootServiceCollection).GetService(Service);

        expect(service).toBeInstanceOf(Service);
    });
    test('CustomServiceCollectionProvidedIn_UseItInsteadOfRootServiceCollection', () => {
        const customServiceCollection = new ServiceCollection();
        @Injectable({
            provideIn: customServiceCollection,
            lifetime: ServiceLifetime.Singleton
        })
        class Service { }

        const service = Injector.Of(customServiceCollection).GetService(Service);

        expect(service).toBeInstanceOf(Service);
    });

    test('NotSupportedLifetime_ArgumentExceptionThrown', () => {
        expect(() => {
            @Injectable({
                provideIn: 'root',
                lifetime: randomString() as any
            })
            class Service { }
        }).toThrowErrorOfType(ArgumentException);
    });
    test('ScopedLifetime_UseAddScoped', () => {
        const context = Injector.Create();
        @Injectable({
            provideIn: 'root',
            lifetime: ServiceLifetime.Scoped
        })
        class Service { }

        const service = Injector.GetService(Service, context);

        expect(service).toBeInstanceOf(Service)
    });
    test('SingletonLifetime_UseAddSingleton', () => {
        @Injectable({
            provideIn: 'root',
            lifetime: ServiceLifetime.Singleton
        })
        class Service { }

        const service = Injector.GetService(Service);

        expect(service).toBeInstanceOf(Service)
    });
    test('TransientLifetime_UseAddTransient', () => {
        @Injectable({
            provideIn: 'root',
            lifetime: ServiceLifetime.Transient
        })
        class Service { }

        const service1 = Injector.GetService(Service);
        const service2 = Injector.GetService(Service);

        expect(service1).toBeInstanceOf(Service);
        expect(service2).toBeInstanceOf(Service);
        expect(service1 !== service2).toBeTruthy();
    });
});

function randomString() {
    return Math.random().toString(36).substring(2);
}