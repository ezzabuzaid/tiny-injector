
export * from './Context';
export * from './Exceptions';
export * from './Helpers';
export * from './Inject';
export * from './Injectable';
export * from './InjectionToken';
export * from './Injector';
export * from './ServiceLifetime';

import { Context } from './Context';
import { Injector } from './Injector';

Injector.AddScoped(Context, (context) => context);
