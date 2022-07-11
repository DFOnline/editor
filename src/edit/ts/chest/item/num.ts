import type { Number } from "edit/template";
import context from "../../../../main/context";
import chestMenu from "../chestMenu";
import ChestItem from "./chestitem";

export default class Num extends ChestItem {
    backgroundUrl = 'https://dfonline.dev/public/images/SLIME_BALL.png';
    item : Number;

    movable = false;

    constructor(item : Number){
        super(item);
    }

    valueContext(id : number): context {
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

        const ctxBox = new context('Number',[value]);

        return ctxBox;
    }

    icon(itemElement : HTMLDivElement){
        itemElement.style.backgroundImage = `url(${this.backgroundUrl})`;
        const count = document.createElement('span');
        count.innerText = this.item.data.name;
        count.style.color = "rgb(255, 85, 85)"
        itemElement.append(count);
    }
}