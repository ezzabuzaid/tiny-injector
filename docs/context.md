# Context

The context is a special object that binds a set of services, it is purpose is to define a scope for *Scoped* services instances and to easily distinguish them.

It exist to provide the same instance of a *Scoped* service during the request lifetime.

---

## Create Context

* A Context can be created using `Create()` method.

```typescript
@Injectable({
    lifetime: ServiceLifetime.Scoped
})
class Logger { }

const context = Injector.Create();
const logger = Injector.Locate(Logger, context);

// Remove the context and everything bound to it.  
Injector.Destroy(context);
```

The above sample creates a context and used it to return an instance of `Logger` type, after finish dealing with that instance the context should be destroyed to free up the memory

* Using `CreateScope()`

The other way is to use `CreateScope()` which simplifies the consumption of Scoped services.

`CreateScope` takes function that provide the context as argument. the function could be void or promise

```typescript
@Injectable({
    lifetime: ServiceLifetime.Scoped
})
class Logger { }

Injector.CreateScope((context) => {
   const logger = context.get(Logger);
});

```

In this sample, the context created internally and provided as argument, the `get` method used to request a `Logger` instance.

the `Destroy` method is no longer needed since it will be called internally immediately after the function execution is done.

notice that we used the `get` method instead of `Locate` , the `get` method is just helper method that uses `Locate` .

```typescript
const context = Injector.Create();

const logger = context.get(Logger);
// equivalent to 
Injector.Locate(serviceType, context);
```

## Context Extras

A context can holds *extras* which you could use to store additional data

```typescript
const context = Injector.Create();

context.setExtra('data', {});

context.getExtra('data');
```

it's most useful when you want to store some data at the creation of context and use it later on when requesting or registering a service.
