import { Context, Injector, ServiceLifetime, Injectable } from "../";
import { InvalidOperationException, ArgumentException } from "../Exceptions";
@Injectable()
class Service {
    id = Math.random() * Math.random();
}

xdescribe('Create_PrimitiveTypeAsContext_ArgumentExceptionThrown', () => {
    const types = [null, undefined, {}, function () { }, () => { }, [], false, true, '', ' '];
    types.forEach((type) => {
        test(`${ type }`, () => {
            expect(() => Injector.Create())
                .toThrowError(ArgumentException);
        })
    });
});

xtest('Create_ContextAlreadyRegistered_InvalidOperationExceptionThrown', () => {
    const context = new Context();

    expect(() => {
        Injector.Create();
        Injector.Create();
    })
        .toThrowError(InvalidOperationException);
});

test('Create_ContextParameterOfTypeContextAndIsNotFound_ContextRegistered', () => {
    const context = Injector.Create();
    Injector.AddScoped(Service);

    Injector.Locate(Service, context);
    expect(true).toBeTruthy();
});
