let contextMenus : Context[] = []

let contextMenusElement = document.createElement('div');
contextMenusElement.id = 'contextMenus';

/**
 * Run this function immediatly to setup the contextmenus.
 */
export function load(){
    addEventListener('load',() => {
        document.body.append(contextMenusElement);
    })
    addEventListener('click',() => {
        console.log(contextMenus);
        contextMenus.forEach(x => x.close())
    })
}

/**
 * The context menu class, all context menus are `div#contextMenus > div.contextMenu` to have precision
 */
export class Context {
    html : HTMLDivElement


    constructor(values: {[key: string]: Context | HTMLElement | HTMLHRElement}){
        var html = document.createElement('div');
        html.style.position = 'fixed';
        html.classList.add('contextMenu');
        html.onclick = e => {this.close(); e.stopImmediatePropagation()};
        Object.keys(values).forEach(key => {
            var value = values[key];
            if(isContext(value)){
                html.append(key);
            }
            else{
                html.append((value as HTMLElement));
            }
        })
        this.html = html;
    }
    close(){
        contextMenus.splice(contextMenus.findIndex(x => x === this),1);
        this.html.remove();
    }

    /**
     * You can do something like `element.onclick = e => Context.eventOpen(e)` to easily use this.
     * @param event The mouse event to get the position from
     */
    eventOpen(event : MouseEvent, position : "mouse" | "fixed" = "mouse"){
        event.stopPropagation();
        contextMenus.push(this);
        let posY,posX : number;
        if(position === 'fixed')({bottom: posY, right: posX} = (event.target as HTMLElement).getBoundingClientRect());
        else if(position === 'mouse')({clientX: posX, clientY: posY} = (event))
        this.html.style.top = posY + 'px';
        this.html.style.left = posX + 'px';
        contextMenusElement.append(this.html);
    }
}

function isContext(value: any) : boolean{
    return value.constructor.name === "Context";
}