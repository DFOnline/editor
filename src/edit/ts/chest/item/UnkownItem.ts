import ContextMenu from "main/context";
import type { Item } from "../../../template";
import ChestItem from "./chestitem";

export default class UnknownItem extends ChestItem {
    backgroundUrl = 'https://dfonline.dev/public/images/BARRIER.png';
    movable = false;
    item: Item;

    valueContent(){
        return new ContextMenu()
    }

    icon(){
        const itemElement = document.createElement('div');

        itemElement.classList.add('pulse');

        return itemElement
    }
}