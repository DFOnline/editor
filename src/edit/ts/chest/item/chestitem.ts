import type { Item } from "edit/template";
import type ContextMenu from "main/context";

export default abstract class ChestItem {
    backgroundUrl : string;
    item : Item;

    constructor(item : Item){
        this.item = item;
    }

    abstract valueContext(id : number) : ContextMenu;

    abstract icon(itemElement : HTMLDivElement) : void;
}