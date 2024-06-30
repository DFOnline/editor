import { SESSION_STORE } from "../../main/constants";

type CallbackFunction = () => void;

export default class Names { // a class for this lmfao
    private readyFunctions: CallbackFunction[] = [];
    private data: Record<string, string> = {};

    constructor() {
        fetch(sessionStorage.getItem(SESSION_STORE.API_ENDPOINT) + 'names').then(res => res.json()).then(json => {
            this.data = json;
            this.readyFunctions.forEach(f => f());
        })
    }

    onready(callback: CallbackFunction) {
        this.readyFunctions.push(callback);
    }

    get(id: string): string | `%${typeof id}%` {
        let name = this.data[`item.minecraft.${id.toLowerCase().replace('minecraft:', '')}`];
        if (!name) name = `%${id}%`;
        return name;
    }
}
