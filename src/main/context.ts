let contextOverlay : HTMLDivElement;

export const ContextMenus : ContextMenu[] = []

export default class ContextMenu {
    name: string;
    contents: HTMLElement[];
    isOpen = false;
    private HTMLElement : HTMLDivElement;
    interface : HTMLButtonElement;
    private ref : Symbol;

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
        this.ref = Symbol(`ContextMenu.${name}`)

        if(hasTitle) {
            const title = document.createElement('span');
            title.innerText = name;
            this.HTMLElement.append(title);
        }
        this.contents.forEach(i => this.HTMLElement.append(i));
        // stop propogation when any of `events` is ran
        events.forEach(e => {
            console.log(e);
            (this.HTMLElement as any)[e] = (e : Event) => {e.stopImmediatePropagation();}
        })

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
        event.stopImmediatePropagation();
        let x,y : number;
        {({clientX: x , clientY: y } = (event as MouseEvent));}
        if(x == undefined) {({x,y} = (event.target as HTMLElement).getBoundingClientRect())}
        this.use(x,y);
    }

    /**
     * Opens the context menu.
     */
    open(x : number, y : number){
        checkReady();
        if(!this.isOpen){
            this.close();
        }
        this.isOpen = true;
        this.HTMLElement.style.left = x + 'px';
        this.HTMLElement.style.top  = y + 'px';
        contextOverlay.append(this.HTMLElement);
        ContextMenus.push(this);
    }

    /**
     * Closes the context menu.
     */
    close(){
        checkReady();
        this.isOpen = false;
        this.HTMLElement.remove();
        ContextMenus.splice(ContextMenus.findIndex(menu => menu.ref === this.ref),1);
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

        // close all when any of `events` is ran
        events.forEach(e => {(document.body as any)[e] = this.closeAll})
    }

    static closeAll(){
        ContextMenus.forEach(menu => menu.close())
    }

}

/**
 * Throws an error if the context menu hasn't been setup.
 */
function checkReady() {
    if(contextOverlay == undefined) throw new Error('Make sure to run ContextMenu.setup() before using context menus.`');
}

const events = [
    'onclick',
    'onscroll',
    'ontouchmove',
    'oncontextmenu',
    'onmousedown'
];