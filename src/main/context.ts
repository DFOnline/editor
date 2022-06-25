let contextOverlay : HTMLDivElement;

export const ContextMenus : ContextMenu[] = [];

export default class ContextMenu {
    name: string;
    contents: HTMLElement[];

    isOpen = false;
    
    subMenu : HTMLButtonElement;
    topMenu : HTMLButtonElement;
    
    private HTMLElement : HTMLDivElement;
    private ref : Symbol;
    private isFocus = false;

    /**
     * 
     * @param name The name the context should have
     * @param options The HTML elements to be used as options in the context menu. To have another context menu in a context menu use the `ContextMenu.subMenu` value
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
            (this.HTMLElement as any)[e] = (e : Event) => {e.stopImmediatePropagation();}
        })
        this.HTMLElement.onmouseenter = () => {
            this.isFocus = true;
        }
        this.HTMLElement.onmouseleave = () => {
            setTimeout(() => {
                this.isFocus = false;
            })
        }

        this.subMenu = document.createElement('button');
        this.subMenu.classList.add('ctx-sub-menu');
        this.subMenu.innerText = name;
        this.subMenu.onmouseover = () => {
            if(!this.isFocus){
                const {right: x,top: y} = this.subMenu.getBoundingClientRect();
                this.open(x - 2,y);
            }
        };
        this.subMenu.onmouseleave = this.closeChecker.bind(this);
        this.subMenu.onclick = () => {
            const {right: x,top: y} = this.subMenu.getBoundingClientRect();
            this.use(x - 15,y);
        }

        this.topMenu = document.createElement('button');
        this.topMenu.innerText = name;
        this.topMenu.onmouseover = () => {
            if(!this.isFocus){
                const {left: x,bottom: y} = this.topMenu.getBoundingClientRect();
                this.open(x,y - 4);
            }
        };
        this.topMenu.onmouseleave = this.closeChecker.bind(this);
        this.topMenu.onclick = e => {
            e.stopPropagation();
            const {left: x,bottom: y} = this.topMenu.getBoundingClientRect();
            this.use(x,y);
        }
    }

    /**
     * toggles if the context menu is open.
     */
    use(x : number, y : number){
        checkReady();
        if (this.isOpen) this.close();
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
        if(this.isOpen){
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
        this.isFocus = false;
        this.isOpen = false;
        this.HTMLElement.remove();
        ContextMenus.splice(ContextMenus.findIndex(menu => menu.ref === this.ref),1);
    }

    /**
     * Makes sure the elements are in the document and variables are set up.
     * This should only be run when the document is ready.
     */
    static setup(){
        const id = 'contexts'
        const path = 'html body div#' + id;
        if(document.querySelector(path) === null){
            contextOverlay = document.createElement('div');
            contextOverlay.id = id;
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

    private closeChecker() {
        setTimeout(() => {
            if(!this.isFocus){
                this.close();
            }
        })
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