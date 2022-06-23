let contextOverlay : HTMLDivElement;

export default class ContextMenu {
    name: string;
    contents: HTMLElement[];
    isOpen = false;
    private HTMLElement : HTMLDivElement;
    interface : HTMLButtonElement;

    /**
     * 
     * @param name The name the context should have
     * @param options The HTML elements to be used as options in the context menu. To have another context menu in a context menu use the `ContextMenu.interface` value
     * @param hasTitle If the name is used as a title.
     */
    constructor(name : string, options : HTMLElement[], hasTitle = false) {
        this.name = name;
        this.HTMLElement = document.createElement('div');
        this.contents = options;

        if(hasTitle) {
            const title = document.createElement('span');
            title.innerText = name;
            this.HTMLElement.append(title);
        }
        this.contents.forEach(i => this.HTMLElement.append(i));

        this.interface = document.createElement('button');
        this.interface.innerText = name;
    }

    /**
     * toggles if the context menu is open.
     */
    use(x : number, y : number){
        checkReady();
        if(this.isOpen) this.close();
        else this.open(x,y);
    }

    /**
     * Uses a based of an event.
     * @param event Event to get position with
     */
    toggle(event : Event) {
        let x,y : number;
        {({clientX: x , clientY: y } = (event as MouseEvent));}
        if(x == undefined) {({x,y} = (event.target as HTMLElement).getBoundingClientRect())}
        this.use(x,y)
    }

    /**
     * Opens the context menu.
     */
    open(x : number, y : number){
        checkReady();
        if(!this.isOpen){
            this.close();
        }
        this.HTMLElement.style.left = x + 'px';
        this.HTMLElement.style.top  = y + 'px';
        contextOverlay.append(this.HTMLElement);
    }

    /**
     * Closes the context menu.
     */
    close(){
        checkReady();
        this.isOpen = false;
        this.HTMLElement.remove();
    }

    /**
     * Makes sure the elements are in the document and variables are set up.
     * This should only be run when the document is ready.
     */
    static setup(){
        const path = 'html body div#context';
        if(document.querySelector(path) === null){
            contextOverlay = document.createElement('div');
            contextOverlay.id = 'context';
            document.body.appendChild(contextOverlay);
        }
        else {
            contextOverlay = document.querySelector(path);
        }
    }
}

/**
 * Throws an error if the context menu hasn't been setup.
 */
function checkReady() {
    if(contextOverlay == undefined) throw new Error('Make sure to run ContextMenu.setup() before using context menus.`');
}