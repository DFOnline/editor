export default class { // a class for this lmfao
    private readyFunctions : Function[] = [];
    private data : Record<string, string>;
    
    constructor() {
        fetch(sessionStorage.getItem('apiEndpoint') + 'names').then(res => res.json()).then(json => {
            this.data = json;
            this.readyFunctions.forEach(f => f());
        })
    }

    get onready() {
        return (callback : Function) => {
            this.readyFunctions.push(callback);
    }}
    set onready(callback : Function) {
        this.onready(callback);
    }

    get(id : string) : string | 'Unkown'{
        let name = this.data[`item.minecraft.${id.toLowerCase().replace('minecraft','').replace(':','')}`];
        if(name === undefined) {
            name = 'Unkown';
        }
        return name;
    }
}