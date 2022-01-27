
export class Context {
    #extras = new Map<string, any | undefined>();
    constructor() {
        Object.freeze(this);
        Object.seal(this);
    }

    setExtra(name: string, value: any) {
        this.#extras.set(name, value);
    }

    getExtra<T>(name: string): T {
        return this.#extras.get(name);
    }

}

