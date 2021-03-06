import { isConstructor } from "../src/Utils";
import { InjectionToken, ServiceLifetime, ArgumentException } from "../src";
import { Injector } from "../src/Injector";

test('InjectionToken_CreateNewInstance_ReturnReferenceToNewClass', () => {
    const TOKEN = new InjectionToken('UnderTest');
    expect(isConstructor(TOKEN)).toBeTruthy();
});

test('InjectionToken_ImplictTokenAdd_TokenAddedSuccessfully', () => {
    const tokenValue = Math.random();
    const TOKEN = new InjectionToken<number>('UnderTest', {
        lifetime: ServiceLifetime.Singleton,
        implementationFactory: () => tokenValue
    });

    expect(Injector.GetRequiredService(TOKEN)).toEqual(tokenValue);
});

test('InjectionToken_ExplictTokenAdd_TokenAddedSuccessfully', () => {
    const tokenValue = Math.random();
    const TOKEN = new InjectionToken<number>('UnderTest');

    Injector.AddSingleton(TOKEN, () => tokenValue);
    expect(Injector.GetRequiredService(TOKEN)).toEqual(tokenValue);
});

test('InjectionToken_AddAsSingleton_ReturnSameResultOnSubsequentCalls', () => {
    const TOKEN = new InjectionToken<number>('UnderTest');

    Injector.AddSingleton(TOKEN, () => Math.random());

    expect(Injector.GetRequiredService(TOKEN)).toBe(Injector.GetRequiredService(TOKEN));
});

test('InjectionToken_AddAsScoped_ReturnSameForTheSameContext', () => {
    const TOKEN = new InjectionToken<number>('UnderTest');
    const context = Injector.Create();

    Injector.AddScoped(TOKEN, () => Math.random());

    expect(
        Injector.GetRequiredService(TOKEN, context)
        ===
        Injector.GetRequiredService(TOKEN, context)
    ).toBeTruthy();
});

test('InjectionToken_AddAsScoped_ReturnDifferentResultForDifferentContexts', () => {
    const TOKEN = new InjectionToken<number>('UnderTest');
    const context1 = Injector.Create();
    const context2 = Injector.Create();

    Injector.AddScoped(TOKEN, () => Math.random());

    expect(
        Injector.GetRequiredService(TOKEN, context1)
        !==
        Injector.GetRequiredService(TOKEN, context2)
    ).toBeTruthy();
});


test('InjectionToken_Options.LifetimeIsNotSupported_ArgumentExceptionThrown', () => {
    expect(() => {
        new InjectionToken<number>('UnderTest', {
            lifetime: 10,
            implementationFactory: () => 10
        });
    }).toThrowError(ArgumentException);
});

test('InjectionToken_ImplementationNotFactoryFunction_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, [], false, true, '', ' '];
    types.forEach((type) => {
        expect(() => {
            new InjectionToken<number>('UnderTest', {
                lifetime: ServiceLifetime.Scoped,
                implementationFactory: type as any
            });
        }).toThrowError(ArgumentException);
    });
});

describe('InjectionToken_NameIsNotString_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        expect(() => {
            new InjectionToken<number>(type as any, {
                lifetime: ServiceLifetime.Scoped,
                implementationFactory: {} as any
            });
        }).toThrowError(ArgumentException);
    });
});
