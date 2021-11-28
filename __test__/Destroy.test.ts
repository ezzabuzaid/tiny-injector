import { Context, ServiceLifetime, Injectable } from "../src";
import { InvalidOperationException, ArgumentException } from "../src/Exceptions";
import { Injector } from "../src/Injector";



describe('Destroy', () => {
    describe('PrimitiveTypeAsContext_ArgumentExceptionThrown', () => {
        const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
        types.forEach((type) => {
            test(`${ type }`, () => {
                expect(() => Injector.Destroy(type as any))
                    .toThrowError(ArgumentException);
            })
        });
    });


    test('ContextNotFound_InvalidOperationExceptionThrown', () => {
        const context = new Context();

        expect(() => {
            Injector.Destroy(context);
        })
            .toThrowError(InvalidOperationException);
    });

    test('ContextParameterOfTypeContextAndIsFound_ContextIsRemoved', () => {
        @Injectable()
        class Service {
            id = Math.random() * Math.random();
        }

        const context = Injector.Create();
        Injector.AddScoped(Service);

        Injector.Destroy(context);
        expect(() => {
            Injector.GetRequiredService(Service, context)
        }).toThrowError(InvalidOperationException);
    });
})
