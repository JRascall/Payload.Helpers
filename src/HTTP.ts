import type Hooks from "./Hook";

export default class HTTP {
    constructor(
        protected readonly hooks: Hooks
    ) { }

    /**
     * make a get request to an http url and return the result
     * @param {string} address url to get
     * @param {(response: unknown) => unknown}} cb callback at end
     */
    public Get(address: string, cb: (response: unknown) => unknown, headers: any = null): void {
        const self = this;
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 401) {
                    self.hooks.Call("http.unauthorized");
                }

                let response = {
                    status: xhttp.status,
                    data: {}
                };

                try {
                    response.data = JSON.parse(xhttp.responseText);
                } catch (e) {
                    response.data = xhttp.responseText;
                }

                cb(response);
            }
        };
        xhttp.open("GET", address, true);

        if (headers != null) {
            Object.keys(headers).forEach(k => {
                const val = headers[k];
                xhttp.setRequestHeader(k, val);
            });
        }

        xhttp.send();
    }

    /**
     * make get async request
     * @param {string} address url to get
     * @returns {any} json
     */
    public async GetAsync(address: string, headers: any = null): Promise<any> {
        return new Promise((resolve) => {
            try {
                this.Get(address, resolve, headers);
            } catch (exception: unknown) {
                this.hooks.Call("http.exception", exception);
                resolve(exception);
            }
        });
    }

    /**
     * make a post request to a http url and return the result
     * @param {string} address url
     * @param {(response: unknown) => void} cb callback executed after request
     */
    public Post(address: string, data: any, cb: (response: unknown) => void, headers: any = null) {
        const self = this;
        const xhttp = new XMLHttpRequest();
        const formData = new FormData();

        Object.keys(data).forEach(k => {
            const value = data[k];
            formData.append(k, value);
        });

        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 401) {
                    self.hooks.Call("http.unauthorized");
                }
                let response = {
                    status: xhttp.status,
                    data: {}
                };

                try {
                    response.data = JSON.parse(xhttp.responseText);
                } catch (e) {
                    response.data = xhttp.responseText;
                }

                cb(response);
            }
        };
        xhttp.open("POST", address, true);

        if (headers != null) {
            Object.keys(headers).forEach(k => {
                const val = headers[k];
                xhttp.setRequestHeader(k, val);
            });
        }

        xhttp.send(formData);
    }

    /**
     * make a async post to a http url
     * @param address
     * @param data
     * @returns
     */
    public async PostAsync(address: string, data: any, headers: any = null): Promise<any> {
        return new Promise((resolve) => {
            try {
                this.Post(address, data, resolve, headers);
            } catch (exception: unknown) {
                this.hooks.Call("http.exception", exception);
                resolve(exception);
            }
        });
    }

    /**
     * make a delete request to a http url and return the result
     * @param {string} address url
     * @param {(response: unknown) => void} cb callback executed after request
     */
    public Delete(address: string, data: any, cb: (response: unknown) => void, headers: any = null) {
        const self = this;
        const xhttp = new XMLHttpRequest();
        const formData = new FormData();
        if (data) {
            Object.keys(data).forEach(k => {
                const value = data[k];
                formData.append(k, value);
            });
        }

        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 401) {
                    self.hooks.Call("http.unauthorized");
                }
                let response = {
                    status: xhttp.status,
                    data: {}
                };

                try {
                    response.data = JSON.parse(xhttp.responseText);
                } catch (e) {
                    response.data = xhttp.responseText;
                }

                cb(response);
            }
        };
        xhttp.open("Delete", address, true);

        if (headers != null) {
            Object.keys(headers).forEach(k => {
                const val = headers[k];
                xhttp.setRequestHeader(k, val);
            });
        }
        xhttp.send(formData);
    }

    /**
     * make a async delete to a http url
     * @param address
     * @param data
     * @returns
     */
    public async DeleteAsync(address: string, data: any, headers: any = null): Promise<any> {
        return new Promise((resolve) => {
            try {
                this.Delete(address, data, resolve, headers);
            } catch (exception: unknown) {
                this.hooks.Call("http.exception", exception);
                resolve(exception);
            }
        });
    }
}