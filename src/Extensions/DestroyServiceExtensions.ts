import { Type } from "../Types";

export abstract class DestroyServiceExtensions {
    public abstract Remove(serviceType: Type<any>): void;
}