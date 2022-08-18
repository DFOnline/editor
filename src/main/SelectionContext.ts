import ContextMenu from './context';

/**
 * A context which takes a selection of items and p
 */
export default class SelectionContext extends ContextMenu {
    /**
     * The callback called when a selection is made
     * @param _value The value that has been selected
     */
    callback = (_value: string) => {return;};

    constructor(name: string, private values: {[key: string]: string[]}, hasTitle: boolean){
        const searchOutput = document.createElement('div');
        const valueInput = document.createElement('input');
        super(name,[valueInput,searchOutput],hasTitle);
        this.SearchOutput = searchOutput;
        this.ValueInput = valueInput;
        this.ValueInput.type = 'text';
        this.ValueInput.addEventListener('input',() => {
            this.querySearch();
        });
        Object.entries(values).forEach(([key,value]) => {
            value.forEach(v => {
                this.SearchValues[v] = key;
            });
        });
    }

    querySearch(){
        this.SearchOutput.innerHTML = '';
        const query = this.ValueInput.value.toLowerCase();
        Object.entries(this.values).forEach(([key,value]) => {
            if(value.find(k => k.toLowerCase().includes(query))){
                const button = document.createElement('button');
                button.innerText = key;
                button.addEventListener('click',() => {
                    this.value = key;
                    this.callback(key);
                    this.close();
                } );
                this.SearchOutput.appendChild(button);
            }
        })
    }

    open(x: number, y: number): void {
        this.querySearch();
        super.open(x,y);
    }

    private SearchValues: {[key: string]: string} = {}
    private SearchOutput: HTMLDivElement;
    private ValueInput: HTMLInputElement;
    get value(){ return this.ValueInput.value; }
    set value(value: string){ this.ValueInput.value = value; }
}