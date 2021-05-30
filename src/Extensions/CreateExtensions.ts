import { AbstractServiceCollection } from "../AbstractServiceCollection";
import { ArgumentException, InvalidOperationException } from "../Exceptions";
import { GetRequiredService } from "./LocateExtensions";
import { Context } from "../Context";
import { ServiceProvider } from "../ServiceProvider";

/**
 * Create a context and immediately destroy it after computation is done.
 *
 * @param computation
 */
export async function CreateScope(computation: (context: Context) => Promise<void> | void) {
    const context = Create();
    await computation(context);
    Destroy(context);
}

/**
 * Create context
 */
export function Create() {
    return ServiceProvider.GetInstance().Create();
}

export function Destroy(context: Context) {
    const serviceProvider = GetRequiredService(AbstractServiceCollection);

    if (!(context instanceof Context)) {
        throw new ArgumentException(`${ context } should be of type Context`, 'context');
    }

    if (!serviceProvider.HasContext(context)) {
        throw new InvalidOperationException("Cannot find context");
    }

    serviceProvider.DeleteContext(context);
}
