# Context

The context is a special object that binds a set of services, it is purpose is to define a scope for a group of services.

It is primarly existed to limit the lifetime of a service or set of services.

Imagine in an express app, each time the user requests the server you create a context to limit all service with *Scoped lifetime* to it, and after responding to that request, you remove the context so all services are removed. for instance, there's an internal context used to group all singleton services, what made them singleton is that the context will live throughout the application lifetime.

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

The above sample creates a context and used it to return an instance of `Logger` type, 
when the context is no longer needed you have to destroy it to free up the memory.

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

## Summary

1. Think of **Context** as map that store service.

2. All singleton services are managed interally by a context.

3. There's two way you can create context, using `Create` or `CreateScope`.

4. If you created a context using `Create` make sure to destroy it.

5. Don't use `context.get` with Singleton lifetime.

6. Use context extras as way to manage your code, do not use it to store any dependencies.
