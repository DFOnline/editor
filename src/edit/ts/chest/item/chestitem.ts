import chestMenu from "../chestMenu";
import type { Item, Number } from "../../../template";
import ContextMenu from "../../../../main/context";

export default abstract class ChestItem {
    backgroundUrl : string;
    item : Item;

    abstract movable : boolean;

    constructor(item : Item){
        this.item = item;
    }

    abstract contextMenu(id : number) : ContextMenu;

    abstract icon() : HTMLDivElement;

    static getItem(item : Item){
        return getItem(item);
    }
}

export class UnknownItem extends ChestItem {
    backgroundUrl = 'https://dfonline.dev/public/images/BARRIER.png';
    item: Item;

    movable = false;

    constructor(item: Item){
        super(item);
    }

    contextMenu(_id: number): ContextMenu {
        return new ContextMenu('Unknown',[],true);
    }

    icon(){
        const itemElement = document.createElement('div');

        itemElement.style.backgroundImage = `url(${this.backgroundUrl})`;
        itemElement.classList.add('pulse');

        return itemElement
    }
}

export class Num extends ChestItem {
    backgroundUrl = 'https://dfonline.dev/public/images/SLIME_BALL.png';
    item : Number;

    movable = true;

    constructor(item : Number){
        super(item);
    }

    contextMenu(id : number): ContextMenu {
        const value = document.createElement('input');

        value.value = this.item.data.name;
        value.onkeydown = e => {
            if(e.key === 'Enter'){
                if(!e.shiftKey){
                    this.item.data.name = value.value;
                    chestMenu(id);
                    ctxBox.close();
                }
                else{
                    value.value += '\n';
                }
            }
            if(e.key === 'Escape'){
                ctxBox.close();
            }
        }
        value.onclick = e => e.stopPropagation();

        const ctxBox = new ContextMenu('Number',[value]);

        return ctxBox;
    }

    icon(){
        const itemElement = document.createElement('div');
        
        itemElement.style.backgroundImage = `url(${this.backgroundUrl})`;
        const count = document.createElement('span');
        count.innerText = this.item.data.name;
        count.style.color = "rgb(255, 85, 85)"
        itemElement.append(count);
        
        return itemElement
    }
}


function getItem(item : Item){
    switch(item.id){
        case 'num': return new Num(item);
        default: return new UnknownItem(item);
    }
}