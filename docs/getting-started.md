# Getting Started

---

## Setup

### Installation

Installation can be only done using a package manager and it can only be used in typescript codebase.

* Using npm

 `npm install tiny-injector`

* Using yarn

 `yarn add tiny-injector`

### Configuration

include these two options in tsconfig.json

```json
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
```

## Example

Abstract class that defines simple method to log information and errors.

```typescript

abstract class Logger {

    abstract debug(...objects: any[]): void;
    abstract error(error: Error): void;

}

```

This abstract class is implemented by two concrete types

```typescript
import { Injector, Injectable } from 'tiny-injector';

@Injectable()
class FileLogger extends Logger {
    debug(...objects: any[]) {
        // write to debug file
    }

    error(error: Error){
        // write to error file
    }
}

@Injectable()
class ConsoleLogger extends Logger {
    debug(...objects: any[]) {
        console.log('DEBUG', new Date().toString())
        console.log(...objects);
    }

    error(error: Error){
        console.error(error);
    }
}

```

The sample code register the `abstract Logger` service with the concrete type `FileLogger` in production and `ConsoleLogger` otherwise. The AddSingleton method registers the service with a Singleton lifetime.

```typescript

if (process.env === 'production'){
    Injector.AddSingleton(Logger, FileLogger);
} else {
    Injector.AddSingleton(Logger, ConsoleLogger);
}

```

in this sample, the `abstract Logger` is requestd in `DataProvider` constructor.
the injector is requesting DataProvider and executing the fetchData method.

```typescript
@Injectable()
class DataProvider {
    constructor(private logger: Logger) {
        logger.debug('DataProvider');
    }

    async fetchData() {
        try {
            return await fetch('.../data');
        } catch (error) {
            this.logger.error(error);
        }
    }
}

Injector.AddSingleton(DataProvider);

const dataProvider = Injector.Locate(DataProvider);
dataProvider.fetchData();
```

as you can see we provided two arguments when adding the `abstract Logger` service and only one argument when adding the `DataProvider` service.
