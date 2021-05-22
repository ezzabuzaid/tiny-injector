# Using Dependency Injection

## Injecting A Service

### Injecting single service

1. Declare service and decorated with `@Injectable()`.
2. Specify lifetime.
3. Define it as parameter in class constructor.

```typescript
@Injectable()
class InformativeLogger {}

@Injectable()
class WarningLogger {}

@Injectable()
class Application {
    constructor(
        private informativeLogger: InformativeLogger,
        private warningLogger: WarningLogger
    ) { }
}
Injector.AddSingleton(InformativeLogger);
Injector.AddSingleton(WarningLogger);
Injector.AddSingleton(Application);
```

### Injecting Array of service type

```typescript
abstract class Logger {}

@Injectable()
class InformativeLogger {}

@Injectable()
class WarningLogger {}

@Injectable()
class Application {
    constructor(
        @Inject(Logger) private loggers: Logger[],
    ) { }
}

Injector.AppendSingleton(Logger, InformativeLogger);
Injector.AppendSingleton(Logger, WarningLogger);
Injector.AddSingleton(Application);
```

The sample declares `Logger` abstract class and register it as Singleton with two concrete implementation.

The `@Inject` decorator is requried to get array of implementations for a service type but also you have to make sure that the type of parameter is Array as `Logger[]` or `Array<Logger>`

```typescript
@Injectable()
class Application {
    constructor(
        @Inject(Logger) private loggers: Logger,
    ) { }
}
```

if the array type omitted the last registerd implementation will be returned.

### Injecting context

In case you don't have the service added yet, you can inject the `Context` serviceType to later use it to locate the deferred service

```typescript
@Injectable()
class Test { }

@Injectable()
class Service {
    constructor(
        private context: Context
    ) {
        // Calling `this.someMethod()` here will throw an error since Test serviceType is not added yet.

        // Supposedly, the Test service will be added before two seconds
        setTimeout(()=>{
            Injector.AddSingleton(Test);
            this.someMethod();
        }, 2000);
    }

    someMethod() {
       return context.get(Test);
    }
}

```

Another approche where you use service locator approche to get the requested instance

## Locating A Service

Singleton and Scoped lifetimes are bound to a context.

For Singleton there's a context that is used internally, but for Scoped service you have to create them yourself.

### Singleton

```typescript
@Injectable()
class SingletonService {}
Injector.AddSingleton(SingletonService);

const service = Injector.Locate(SingletonService);
```

### Scoped

Scoped is more like Singleton but within context, so you need to create context and provide it.

```typescript
@Injectable()
class ScopedService {}
Injector.AddScoped(ScopedService); 

const context = Injector.Create(); 
const scopedService1 = Injector.Locate(ScopedService, context); 
const scopedService2 = Injector.Locate(ScopedService, context); // return the same instance as above, scopedService1 === scopedService2

const secondContext = Injector.Create(); 
const scopedService3 = Injector.Locate(ScopedService, secondContext); // will return new instance
```

Don't forgot to destroy the context when you done using it.

```typescript
Injector.Destroy(context);
```

### Transient

```typescript
@Injectable({
    lifetime: ServiceLifetime.Transient
})
class TransientService {
    constructor() { }
}

const transientService = Injector.Locate(TransientService); 
```

In case you did inject a *Scoped* service into a *Transient* service, you'll have to provide context, otherwise `LifestyleMismatchException` will be thrown.

this happens due to the fact that *Scoped* service created once per context and *Transient* service are created each time is requested, hence without context you'll have different instance for the *Scoped* service within the *Transient* service so providing a context will make sure that the same scoped service is returned regardless of how many times the *Transient* service created.

```typescript
@Injectable({
    lifetime: ServiceLifetime.Scoped
})
class ScopedService {}

@Injectable({
    lifetime: ServiceLifetime.Transient
})
class TransientService {
    constructor(scopedService: ScopedService) { }
}

// Will throw an exception
const transientService = Injector.Locate(TransientService);

// works fine.
const context = Injector.Create();
const logger1 = Injector.Locate(TransientService, context);
const logger2 = Injector.Locate(TransientService, context);

/**
 * Now, logger1 and logger2 are different instances but, 
 * logger1.scopedService and logger2.scopedService are the same
 */
```

It is always preferred to pass context with *Transient* services to avoid an handled exceptions.

### Locating Array of the same service type

```typescript
abstract class Logger { }

@Injectable()
class InformativeLogger extends Logger { }

@Injectable()
class WarningLogger extends Logger { }

Injector.AppendSingleton(Logger, InformativeLogger);
Injector.AppendSingleton(Logger, WarningLogger);

Injector.Locate({serviceType: Logger, multiple: true, context: /** In case of Scoped or Transient */});
```

## Lifetime and registration options

```typescript

abstract class Operation {
    abstract operationId: string;
}

@Injectable({
    lifetime: ServiceLifetime.Transient
})
class OperationTransient extends Operation {
    operationId = Math.random().toString(36);
}

@Injectable({
    lifetime: ServiceLifetime.Scoped
})
class OperationScoped extends Operation {
    operationId = Math.random().toString(36);
}

@Injectable({
    lifetime: ServiceLifetime.Singleton
})
class OperationSingleton extends Operation {
    operationId = Math.random().toString(36);
}

@Injectable()
class Application {
    constructor(
        private transientOperation1: OperationTransient,
        private transientOperation2: OperationTransient,
        private scopedOperation1: OperationScoped,
        private scopedOperation2: OperationScoped,
        private singletonOperation: OperationSingleton,
    ) { }    
}

const context = Injector.Create();
const app = Injector.Locate(Application, context);

console.log(app.transientOperation1.operationId === app.transientOperation2.operationId); // false

console.log(app.scopedOperation1.operationId === app.scopedOperation2.operationId); // true
```

* Transient objects are always different. transientOperation2 is not the same as transientOperation1.

* Scoped objects are the same for each context but different across each context.

* Singleton objects are the same for every context.

# Worth mention

* `@Injectable` is required on top of each service even if you don't use it to add service.

* Once you add service you cannot override it and an error will be throw if you tried to do so.

* If you want to override a service you have to use `Injector.Replace{Lifetime}` instead.

* A service will only be created when requested with respect to a service lifetime.

* You would use `Append{Lifetime}` to have multiple implementation for the same service type 
