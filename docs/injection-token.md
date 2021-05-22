# Injection Token

Injection tokens allows injection of values that don't have a runtime representation.
  
Use an InjectionToken whenever the type you are injecting is not reified (does not have a runtime representation) such as when injecting an interface, callable type, array or parameterized type.
  
InjectionToken is parameterized on T which is the type of object which will be returned by the Injector.
  
[Reference](https://github.com/angular/angular/blob/master/packages/core/src/di/injection_token.ts)

```typescript
interface MyInterface {
    name: string;
    age: number; 
}
const token = new InjectionToken<MyInterface>('MyInterfaceToken');
Injector.AddSingleton(token, () => {
    return {
        name: "Jon",
        age: 20
    };
})
```

Providing primitive values

```typescript
const token = new InjectionToken<boolean>('ProductionEnv');

Injector.AddSingleton(token, () => process.env.NODE_ENV === 'production');

const isProduction = Injector.Locate(token);

// Or

@Injectable({
    lifetime: ServiceLifetime.Singleton
})
class MyService {
    constructor(@Inject(token) isProduction: boolean) {
    }
}
```

Or even better you can specify option argument

```typescript
interface MyInterface {
    name: string;
    age: number; 
}
const token = new InjectionToken<MyInterface>('MyInterfaceToken', {
    lifetime: ServiceLifetime.Singleton,
    implementationFactory: () => {
        return {
            name: "Jon",
            age: 20
        };
    }   
});
```
