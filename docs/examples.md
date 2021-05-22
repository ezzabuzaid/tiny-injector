# Examples

## Express JS

I'll assume that you're using Node.js with express, otherwise head to Wiki pages where you can find an examples for other frameworks.

* Setup HTTP server

```typescript
import express from 'express';
import { Injector, ServiceLifetime } from 'tiny-injector';

const application = express();

application.listen('8080', () => {
    console.log(`${ new Date() }: Server running at http://localhost:8080`);
});
```

* Create top level express middleware that will make Scoped service possiple for each request

```typescript
application.use((req, res, next) => {
    const context = Injector.Create();
    const dispose = () => Injector.Destroy(context);
    // At the end the current request, everything related to that context should be garbage collected
    // so you need to make sure that you let that happen by calling dispose function

    ['error', 'end'].forEach((eventName) => {
        req.on(eventName, dispose);
    })

    // Helper function to be able to retrieve services easily
    req.locate = (serviceType) => context.get(serviceType);
    // Or
    req.locate = (serviceType) => Injector.Locate(serviceType, context);
    next();
});
```

```typescript

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

## Add request injection token

From the previous example

1. Set reference to request object

```typescript
application.use((req, res, next) => {
    // Create context ...

    // attach the request to the context so you can refernce it later on
    context.setExtra('request', req);
    
    // rest of code 
});
```

2. Create *InjectionToken*

`request_token.ts` file

```typescript
import { Request } from "express";
export const REQUEST_TOKEN = new InjectionToken<Request>('TOKEN_REQUEST');
```

3. Add it as *Scoped* service

```typescript
Injector.AddScoped(REQUEST_TOKEN, (context) => context.getExtra('request'));
```

4. Use it ^^

```typescript
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
