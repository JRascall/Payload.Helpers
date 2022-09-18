export default class Store {
    protected temp: Storage;
    protected perm: Storage;

    constructor() {
        this.temp = window.sessionStorage;
        this.perm = window.localStorage;
    }

    public get(key: string): any {
        return  this.temp.getItem(key) ||
            this.perm.getItem(key) ||
            null;
    }

    public set(key: string, item: any, perm: boolean = false): void {
        let storage = this.temp;
        if (perm) storage = this.perm;
        storage.setItem(key, item);
    }

    public clear(key: string): void {
        this.temp.removeItem(key);
        this.perm.removeItem(key);
    }

    public clearAll(): void {
        this.temp.clear();
        this.perm.clear();
    }
}