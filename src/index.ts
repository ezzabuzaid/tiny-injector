
export * from './Context';
export * from './Exceptions';
export * from './Helpers';
export * from './Inject';
export * from './Injectable';
export * from './Injector';
export * from './ServiceLifetime';
export * from './InjectionToken';

import { Context } from './Context';
import { Injector } from './Injector';

Injector.AddScoped(Context, (context) => context);
