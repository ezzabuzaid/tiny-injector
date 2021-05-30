# Service lifetime

Service lifetime is the total time for a service starting from the first time it requested up until it disposed.

The lifetime of a service can be either

* Transient

* Scoped

* Singleton

## Singleton

Singleton lifetime services are created The first time they're requested which means the same instance will be returned for each subsequent request.

Singleton services are created only one time per application and then used for whole the application lifetime

when scope validation is enabled you cannot inject either Transient or Scoped service.

## Transient

Transient lifetime services are created each time they're requested.

if a transient service used in scoped service, it will be disposed along with scoped service which implies that, the Transient will live as long as the Scoped service lives.

## Scoped

Scoped services are created once per context.

Context is special object that usually will be created with each web request.

Scoped objects are the same for each context but different across each context.

[Read More][https://docs.microsoft.com/en-us/dotnet/core/extensions/dependency-injection#scoped]

## Scope validation

1. Using Scoped or Transient service in a Singleton service will eventually be singleton since singleton service will be available througot the application lifetime and that's called [**Captive Dependency**](https://blog.ploeh.dk/2014/06/02/captive-dependency/), when occured,  `LifestyleMismatchException` will be thrown.

2. Injecting Scoped service in Transient service will require context to resolve the Transient service, if no context provided,  `LifestyleMismatchException` will be thrown.

look at *Configuration* section to disable this behaviour

[Reference](https://docs.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)
