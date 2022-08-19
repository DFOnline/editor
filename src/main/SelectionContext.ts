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

    constructor(name: string, private values: {[key: string]: string[]}, doTabulator = false, hasTitle = false){
        const searchOutput = document.createElement('div');
        searchOutput.style.display = 'grid';
        const valueInput = document.createElement('input');
        super(name,[valueInput,searchOutput],hasTitle);
        this.doTabulator = doTabulator;
        this.SearchOutput = searchOutput;
        this.ValueInput = valueInput;
        this.ValueInput.type = 'text';
        this.ValueInput.addEventListener('input',this.querySearch.bind(this));
        this.ValueInput.addEventListener('keydown',this.onchange.bind(this));
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
        });
        this.hilight();
    }

    hilight(){
        this.SearchOutput.querySelector('.selected')?.classList.remove('selected');
        if(this.selectedButton != null) this.selectedButton.classList.add('selected');
    }
    
    private onchange(e : KeyboardEvent){
        e.stopPropagation();
        if(e.key === 'Enter'){
            if(this.selectedButton != null) this.selectedButton.click();
            return;
        }
        if(e.key === 'Tab' && this.doTabulator){
            if(!e.shiftKey) this.SelectedIndex++;
            else            this.SelectedIndex--;
            if(this.SelectedIndex >= this.SearchOutput.children.length){
                this.SelectedIndex = 0;
            }
            if(this.SelectedIndex < 0){
                this.SelectedIndex = this.SearchOutput.children.length - 1;
            }
            this.doSelectIndex();
            this.hilight();
            e.preventDefault();
            return;
        }
        if(e.key === 'ArrowDown' && this.doTabulator){
            this.SelectedIndex++;
            if(this.SelectedIndex >= this.SearchOutput.children.length){
                this.SelectedIndex = 0;
            }
            this.doSelectIndex();
            this.hilight();
            e.preventDefault();
            return;
        }
        if(e.key === 'ArrowUp' && this.doTabulator){
            this.SelectedIndex--;
            if(this.SelectedIndex < 0){
                this.SelectedIndex = this.SearchOutput.children.length - 1;
            }
            this.doSelectIndex();
            this.hilight();
            e.preventDefault();
            return;
        }
        this.SelectedIndex = 0;
    }

    doSelectIndex(){
        const value = this.value;
        const selectionStart = value.length;
        const text = this.ValueInput.value = (this.SearchOutput.children[this.SelectedIndex] as HTMLButtonElement).innerText;
        const selectionEnd = text.length;
        this.ValueInput.setSelectionRange(selectionStart,selectionEnd);
    }

    open(x: number, y: number): void {
        this.SelectedIndex = 0;
        this.querySearch();
        super.open(x,y);
        this.ValueInput.focus();
    }

    private SearchOutput: HTMLDivElement;
    private ValueInput: HTMLInputElement;
    private SelectedIndex = 0;
    private doTabulator = false;
    get value(){
        // return all the text before the selectedRange
        return this.ValueInput.value.substring(0,this.ValueInput.selectionStart);
    }
    set value(value: string){ this.ValueInput.value = value; }
    private get selectedButton(){ return this.SearchOutput.children[this.SelectedIndex] as HTMLButtonElement; }
}