# Tiny Injector

A tiny yet powerful and flexible TypeScript Dependency Injection library.
it uses class constructor to identify and inject its dependencies

The work heavily inspired by . NET Dependency Injection, Angular +2 and [This Answer](https://stackoverflow.com/a/48187842/10415423).

## Overview

TBD

## Features

Included

* Supports Node.js and anything uses TypeScript.
* Singleton, Scoped and Transient service lifetime.
* Auto scope validation.

Not Included

* Property injection
* Injection based on name
* Custom lifetime management

TODO:

1. Service disposal.
2. Asynchronous registration.
3. Provide user-defined options.
4. Replace service functionality
5. Error less service registration via Try{ServiceLifetime} methods

## Other third-party libraries

Worth to mention other great libraries.

1. [InversifyJS](https://www.npmjs.com/package/inversify)
2. [Awilix](https://www.npmjs.com/package/awilix)
3. [BottleJS](https://www.npmjs.com/package/bottlejs)
4. [injection-js](https://www.npmjs.com/package/injection-js)

## Setup

Installation can be only done using a package manager and it can only be used in typescript codebase.

* Using npm

 `npm install tiny-injector`

* Using yarn

 `yarn add tiny-injector`

include these two options in tsconfig.json

``` json
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
```

## Terms & Definitions

### Service lifetimes

A service can be either

* Transient: Transient services are created each time they're requested or injected.

* Scoped: Scoped services are created once per context.

* Singleton: Singleton services are created The first time they're requested which means the same instance will be returned for each subsequent request.

### Context

A context is a special object that binds a set of services.

context can be created using `Injector.Create()` method, and to be used later on when locating *Scoped* or *Transient* services.

``` typescript
@Injectable({ lifetime: ServiceLifetime.Scoped })
class Service { }

const context = Injector.Create();
Injector.Locate(Service, context);
```

also, a context can holds *extras* which you could use to store additional data

``` typescript
const context = Injector.Create();

context.setExtra('data', {});

context.getExtra('data');
```

### Injection Token

Injection tokens allows injection of values that don't have a runtime representation.
  
Use an InjectionToken whenever the type you are injecting is not reified (does not have a runtime representation) such as when injecting an interface, callable type, array or parameterized type.
  
InjectionToken is parameterized on T which is the type of object which will be returned by the Injector.
  
[Reference](https://github.com/angular/angular/blob/master/packages/core/src/di/injection_token.ts)

``` typescript
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

``` typescript
const token = new InjectionToken<boolean>('ProductionEnv');

Injector.AddSingleton(token, () => process.env.NODE_ENV === 'production');

const isProduction = Injector.Locate(token);
// or by injecting it

@Injectable({
    lifetime: ServiceLifetime.Singleton
})
class MyService {
    constructor(@Inject(token) isProduction: boolean) {
    }
}
```

Or even better you can specify option argument

``` typescript
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

### Scope validation

Using Scoped or Transient service in a Singleton service will eventually be singleton since singleton will be available througot the application lifetime and that's called [**Captive Dependency**](https://blog.ploeh.dk/2014/06/02/captive-dependency/), luckly, you don't need to worry about that since an error will be thrown at application start if captive dependency occures.

look at *Configuration* section to disable this behaviour

### Inheritance

Because of JavaScript nature, having different classes with the same properties and methods make them equivalent in regards to type, so the below code will work with no errors, although, this code can be handled at runtime using `instanceof` keyword

``` typescript
class Test {
    variable = 10;
}

class Service {
    variable = 10;
}

class Implementation extends Test { }

Injector.AddSingleton(Service, Implementation);
```

look at *Configuration* section to disable this behaviour

## Usage

### Adding service

Adding services can be done in two different way

1. Using `Injector.add{ServiceLifetime}`
2. Using `@Injectable` decorator.

#### Using ServiceLifetime methods

``` typescript
Injector.AddSingleton(serviceType): void;
Injector.AddSingleton(serviceType, serviceType): void;
Injector.AddSingleton(serviceType, implementationType): void;
Injector.AddSingleton(serviceType, implementationFactory): void;
```

angular way would be

``` typescript
providers: [
    serviceType,
    {
        provide: serviceType,
        useClass: serviceType
    },
    {
        provide: serviceType,
        useClass: implementationType
    },
    {
        provide: serviceType,
        useFactory: factoryFn
    }
]
```

Real world example

``` typescript
abstract class Logger {}

class InformativeLogger extends Logger {}

Injector.AddSingleton(Logger, InformativeLogger);
```

that's must useful in test where you can easily create mocks and replace them with the abstraction.
moreover you can provide `implementationFactory` function to execute some logic before requesting the service.

Note: Make sure that serviceType is always class (sugar syntax) otherwise an error will be thrown.

``` typescript
Injector.AddSingleton(Logger, () => {
    // Some interesting logic
   return new InformativeLogger();
});
```

#### Using @Injectable

``` typescript
@Injectable({
    lifetime: ServiceLifetime.Scoped
})
class ScopedLogger {}

@Injectable({
    lifetime: ServiceLifetime.Transient
})
class TransientLogger {}

@Injectable({
    lifetime: ServiceLifetime.Singleton
})
class SingletonLogger {}
```

same applies for other services lifetime

### Injecting service

1. Declare service (class) and decorated with `@Injectable()`.
2. Add it with correct lifetime.
3. Define it as parameter in class constructor.

``` typescript
@Injectable()
class InformativeLogger {}

@Injectable()
class WarningLogger {}

@Injectable()
class TransientLogger {
    constructor(
        private informativeLogger: InformativeLogger,
        private warningLogger: WarningLogger
        ) { }
}
Injector.AddSingleton(InformativeLogger);
Injector.AddSingleton(WarningLogger);
Injector.AddSingleton(TransientLogger);
```

Make sure to add the services in order otherwise `ActivationFailedException` will be thrown.
see [Helper Functions](#helper-functions)

1. Add the service dependencies types
2. Add the service it self

Do

``` typescript
Injector.AddSingleton(InformativeLogger);
Injector.AddSingleton(WarningLogger);
Injector.AddSingleton(TransientLogger);
```

Do not.

``` typescript
Injector.AddSingleton(TransientLogger);
Injector.AddSingleton(InformativeLogger);
Injector.AddSingleton(WarningLogger);
```

#### Injecting Array of the same service type

``` typescript
abstract class Logger {}

@Injectable()
class InformativeLogger {}

@Injectable()
class WarningLogger {}

@Injectable()
class ErrorLogger {
    constructor(
        @Inject(Logger) private loggers: Logger[],
        ) { }
}

Injector.AppendSingleton(Logger, InformativeLogger);
Injector.AppendSingleton(Logger, WarningLogger);
Injector.AppendSingleton(Logger, ErrorLogger);
```

You can use AddSingleton for the first add, but to be in safe side use AppendSingleton if you want to have array of implementations.

The `@Inject` decorator is used to get array of implementations for a service type, it could also be used get one service.

``` typescript
@Injectable()
class TransientLogger {
    constructor(
        @Inject(Logger) private loggers: Logger, // will return the last added implementation which is ErrorLogger
        ) { }
        // @Inject(Logger) is optional here
}
```

#### Injecting context

In case you don't have the service added yet, you can inject the `Context` serviceType to later use it to locate the deferd service

``` typescript
@Injectable()
class Test { }

@Injectable()
class Service {
    constructor(
        private context: Context
    ) {
        // Calling `this.someMethod()` here will throw an error since Test serviceType is not added yet.
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

### Locating service

Singleton and Scoped lifetimes are bound to a context.

For Singleton there's a context that is used internally, but for Scoped service you have to create them by yourself.

#### Singleton

``` typescript
@Injectable()
class SingletonLogger {}
Injector.AddSingleton(SingletonLogger);

Injector.Locate(SingletonLogger);
```

#### Scoped

Scoped is more like Singleton but within context, so you need to create context and provide it.

``` typescript
@Injectable()
class ScopedLogger {}
Injector.AddScoped(ScopedLogger); 

const context = Injector.Create(); 
Injector.Locate(ScopedLogger, context); 
Injector.Locate(ScopedLogger, context); // return the same instance as above

const secondContext = Injector.Create(); 
Injector.Locate(ScopedLogger, secondContext); // will return new instance
```

Don't forgot to destroy the context when you done using it.

``` typescript
Injector.Destroy(context);
```

#### Transient

``` typescript
@Injectable({
    lifetime: ServiceLifetime.Transient
})
class TransientLogger {
    constructor() { }
}

Injector.Locate(TransientLogger); 
```

In case you did inject a *Scoped* service into a *Transient* service, you'll have to provide context, otherwise `LifestyleMismatchException` will be thrown in runtime.

this happens due to the fact that *Scoped* service created once per request and *Transient* service are created each time is requested hence without context you'll have different instance for the *Scoped* service within the *Transient* service so providing a context will make sure that the same scoped service is returned regardless of how many times the *Transient* service created.

``` typescript
@Injectable({
    lifetime: ServiceLifetime.Scoped
})
class ScopedLogger {}

@Injectable({
    lifetime: ServiceLifetime.Transient
})
class TransientLogger {
    constructor(private scopedLogger: ScopedLogger) { }
}

// Will throw an exception
Injector.Locate(TransientLogger);

// works fine.
const context = Injector.Create();
const logger1 = Injector.Locate(TransientLogger, context);
const logger2 = Injector.Locate(TransientLogger, context);

/**
 * Now, logger1 and logger2 are different instances but, 
 * logger1.scopedLogger and logger2.scopedLogger are the same
 */
```

It is always preferred to pass context with *Transient* services to avoid an handled exceptions.

#### Locating Array of the same service type

``` typescript
abstract class Logger {}

@Injectable()
class InformativeLogger {}

@Injectable()
class WarningLogger {}

@Injectable()
class ErrorLogger {
}

Injector.AppendSingleton(Logger, InformativeLogger);
Injector.AppendSingleton(Logger, WarningLogger);
Injector.AppendSingleton(Logger, ErrorLogger);

Injector.Locate({serviceType: Logger, multiple: true, context: /** In case of Scoped or Transient */});
```

#### Worth mention

* `@Injectable` is required on top of each service even if you don't use it to add service.

* Once you add service you cannot override it and an error will be throw if you tried to do so.

* if you want to override a service you have to use `Injector.Replace{ServiceLifetime}` instead.

* A service will only be created when requested with respect to a service lifetime.

## Examples

### Express JS

I'll assume that you're using Node.js with express, otherwise head to Wiki pages where you can find an examples for other frameworks.

* Setup HTTP server

``` typescript
import express from 'express';
import { Injector, Context, ServiceLifetime } from 'tiny-injector';

const application = express();

application.listen('8080', () => {
    console.log(`${ new Date() }: Server running at http://localhost:8080`);
});
```

* Create top level express middleware that will make Scoped service possiple for each request

``` typescript
application.use((req, res, next) => {
    const context = Injector.Create();
    const dispose = () => Injector.Distroy(context);
    // At the end the current request, everything related to that context should be garbage collected
    // so you need to make sure that you let that happen by calling dispose function

    // attach the request to the context so you can reference it later on 
    context.setExtra('request', req);

    ['error', 'close'].forEach((eventName) => {
        req.on(eventName, dispose);
    })

    // Helper function to be able to retrieve services easily
    req.locate = (serviceType) => context.get(serviceType);
    // Or
    req.locate = (serviceType) => Injector.Locate(serviceType,context);
    next();
});
```

``` typescript

@Injectable({
    lifetime: ServiceLifetime.Singleton
})
class Configuration {
    get secret() {
        return 'SuperSecret';
    }
}

@Injectable({
    lifetime: ServiceLifetime.Scoped
})
class Uow {
    id = Math.random();
}

@Injectable({
    lifetime: ServiceLifetime.Scoped
})
class UserRepository {
    constructor(
        public uow: Uow
    ) { }
}

@Injectable({
    lifetime: ServiceLifetime.Transient
})
class UserService {
    constructor(
        private userRepository: UserRepository,
        private configuration: Configuration
    ) { }

    login() {
        // some logic ...
        this.resolveToken(this.configuration.secret);
    }

    resolveToken(secret: string) {
        // some logic ...
    }
}

application.get('/test', (req, res) => {
    const service = req.locate(UserService);
    const repo = req.locate(UserRepository);
    res.json({
        service: service.userRepository.uow.id,
        repo: repo.uow.id,
    });
});
```

### Add request injection token

From the previous example

``` typescript
application.use((req, res, next) => {
    // Create context ...

    // attach the request to the context so you can refernce it later on
    context.setExtra('request', req);
    
    // rest of code 
});
```

Create *InjectionToken*

``` typescript
import { Request } from "express";
export const REQUEST_TOKEN = new InjectionToken<Request>('TOKEN_REQUEST');
```

Add it as *Scoped* service

``` typescript
Injector.AddScoped(REQUEST_TOKEN, (context) => context.getExtra('request'));
```

Use it ^^

``` typescript
@Injectable({
    lifetime: ServiceLifetime.Scoped
})
export class DataService {
    constructor(
        @Inject(REQUEST_TOKEN) private request: Request
    ) {
        const userAgent = request.headers['user-agent'];
    }
}
```
