export function Inject<T>(serviceType: T): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        Reflect.defineMetadata(`DI:Inject:${ parameterIndex }`, { serviceType, parameterIndex, propertyKey }, target);
    }
}
