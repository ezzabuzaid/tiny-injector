import { Context, Injector, ServiceLifetime, Injectable } from "../src";
import { InvalidOperationException, ArgumentException } from "../src/Exceptions";
@Injectable()
class Service {
    id = Math.random() * Math.random();
}

describe('Destroy_PrimitiveTypeAsContext_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.Destroy(type as any))
                .toThrowError(ArgumentException);
        })
    });
});

test('Destroy_ContextNotFound_InvalidOperationExceptionThrown', () => {
    const context = new Context();

    expect(() => {
        Injector.Destroy(context);
    })
        .toThrowError(InvalidOperationException);
});

test('Destroy_ContextParameterOfTypeContextAndIsFound_ContextIsRemoved', () => {
    const context = Injector.Create();
    Injector.AddScoped(Service);

    Injector.Destroy(context);
    expect(() => {
        Injector.Locate(Service, context)
    }).toThrowError(InvalidOperationException);
});
