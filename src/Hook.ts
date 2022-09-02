class Hook {
    public Weight: number;

    constructor(
        public Callback: Function,
        weight: number
    ) {
        this.Weight = weight || 0;
    }
}

export default class Hooks {
    protected hooks: Map<string, Hook[]>;

    public get ShowCalls(): boolean {
        return this.showCalls;
    }

    public get ShowWarnings(): boolean {
        return this.showWarnings;
    }

    constructor(
        protected showCalls: boolean = false,
        protected showWarnings: boolean = false
    ) {
        this.hooks = new Map();
    }

    /**
     * register a hook
     * @param name name of the hook to bind to
     * @param callback the function to run when it's called
     * @param weight weight by default is 0, the higher the weight the earlier it is called in the hook sequence
     */
    public Register(name: string, callback: Function, weight: number = 0): void {
        if (name === null || name.length <= 0) throw new Error("name cannot be empty");
        if (callback === null) throw new Error("callback cannot be null");
        name = name.toLowerCase();

        let collection = this.hooks.get(name);
        if (collection === null || collection === undefined) {
            this.hooks.set(name, []);
            collection = this.hooks.get(name);
        }

        const entry = new Hook(callback, weight);

        collection?.push(entry);
        collection?.sort((a, b) => {
            if (a.Weight > b.Weight) return -1;
            if (a.Weight < b.Weight) return 1;
            return 0;
        });
    }

    /**
     * call a hook by name with any args
     * @param name the name of the hook to call
     * @param args any args you want to pass to the hook
     * @returns {number} the amount of hooks called
     */
    public Call(name: string, args: any = null): number {
        if (name === null || name.length <= 0) throw new Error("name cannot be empty");
        name = name.toLowerCase();

        let counter = 0;
        if (this.showCalls) console.log(name);

        const collection = this.hooks.get(name) as Hook[];
        if (collection !== null && collection !== undefined) {
            for (let i = 0; i < collection?.length; i++) {
                try {
                    let returned;

                    if (args !== null && args !== undefined) returned = collection[i].Callback.call(this, args);
                    else returned = collection[i].Callback.call(this);

                    counter++;

                    // If any thing is returned from the hooks we cancel the call useful for overriding hooks
                    if (returned !== null && returned !== undefined && Object.prototype.toString.call(returned) !== "[object Promise]") {
                        break;
                    }
                } catch (e: unknown) {
                    console.error(`Error calling hook - ${name} - ${e}`);
                }
            }
        } else {
            if (this.showWarnings) console.warn(`No hooks registered for - ${name}`);
        }

        return counter;
    }
}