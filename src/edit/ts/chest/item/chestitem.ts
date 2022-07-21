import type { Item } from "edit/template";
import type ContextMenu from "main/context";
import Num from "./num";

export default abstract class ChestItem {
    backgroundUrl : string;
    item : Item;

    abstract movable : boolean;

    constructor(item : Item){
        this.item = item;
    }

    abstract valueContext(id : number) : ContextMenu;

    abstract icon() : HTMLDivElement;

    static getItem(item : Item){
        switch(item.id){
            case 'num': return new Num(item);
            default: return null;
        }
    }
}