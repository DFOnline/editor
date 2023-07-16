import { code, mouseInfo, userMeta } from "../edit";
import Menu from "../../../main/menu";
import newItem from "./newItem";
import type { ArgumentBlock } from "edit/template";
import ChestItem from "./item/chestitem";

/**
 * Opens a chest menu. If one is already open the previous one is overwritted to skip any animations.
 * @param id The id of the block to open the chest of.
 * @returns The menu element opened.
 */
export default function chestMenu(BlockIndex: number) {
    const menuDiv = document.createElement('div');
    const chest = new Menu('Chest', menuDiv);
    menuDiv.id = 'chest';

    /** The block of the chest */
    const block: ArgumentBlock = code.blocks[BlockIndex] as any;

    [...Array(27).keys()].forEach(slotIndex => {
        const slot = document.createElement('div');
        slot.id = 'slot' + String(slotIndex);
        slot.classList.add('slot');
        menuDiv.append(slot);

        let itemElement = document.createElement('div');

        /** The item of the slot */
        const ArrayIndex = block.args.items.findIndex(item => item.slot === slotIndex);
        const item = block.args.items[ArrayIndex];
        if (item) {
            const chestItem = ChestItem.getItem(item.item);
            itemElement = chestItem.icon();
            itemElement.id = 'item' + String(slotIndex);
            itemElement.classList.add('full')

            itemElement.ontouchstart = itemElement.onclick = itemElement.onmouseover = () => {

                mouseInfo.innerHTML = '';

                mouseInfo.style.display = 'block';
                // It is already moved in another loop
                // mouseInfo.style.left = e.clientX + 'px';
                // mouseInfo.style.top = (e.clientY + 50) + 'px';

                mouseInfo.append(chestItem.tooltip());
            }

            itemElement.onmousemove = e => {
                e.stopPropagation();
                mouseInfo.style.left = e.clientX + 'px';
                mouseInfo.style.top = e.clientY + 'px';
            }

            itemElement.onmouseleave = e => {
                e.stopPropagation();
                mouseInfo.style.display = 'none';
                mouseInfo.innerHTML = '';
            }


            itemElement.oncontextmenu = e => {
                e.stopPropagation();
                if (userMeta.canEdit) {
                    e.preventDefault();
                    e.stopPropagation();
                    chestItem.contextMenu(BlockIndex, slotIndex, chestItem.item.id, []).toggle(e);
                }
            }


            if (chestItem.movable) {
                itemElement.draggable = true;

                itemElement.ondragstart = e => {
                    e.stopPropagation();
                    if(!userMeta.canEdit) {
                        e.stopImmediatePropagation();
                        return false;
                    }
                    if (!e.dataTransfer) throw new Error("Error whilst managing data transfer.");
                    e.dataTransfer.clearData();
                    e.dataTransfer.setData('application/x.dfitem', JSON.stringify(item));
                    e.dataTransfer.setData('index', String(item.slot));
                    e.dataTransfer.effectAllowed = 'move';

                    const dragIcon = document.createElement('div');
                    dragIcon.style.backgroundImage = `url(${chestItem.icon().style.backgroundImage})`;
                    dragIcon.style.width = '64px';
                    const div = document.querySelector<HTMLDivElement>('body > div#drag-icon') || document.createElement('div');
                    div.id = 'drag-icon';
                    div.style.position = "absolute"; div.style.top = "0px"; div.style.left = "-500px";
                    document.querySelectorAll('body > div#drag-icon').forEach(div => div.remove());
                    document.body.appendChild(div);

                    mouseInfo.style.display = 'none';
                    return true;
                }
                itemElement.ondragend = () => {
                    document.querySelectorAll('body > div#drag-icon').forEach(i => i.remove());
                }

                itemElement.ondragover = e => e.preventDefault();
                itemElement.ondrop = event => {
                    event.stopPropagation();
                    event.preventDefault();
                    if (!event.dataTransfer) throw new Error("Error whilst managing data transfer.");

                    const targetIndex = Number(item.slot);
                    const draggingIndex = Number(event.dataTransfer.getData('index'));

                    if (draggingIndex !== targetIndex) {
                        // block.args.items[draggingIndex].slot = targetIndex;
                        // block.args.items[targetIndex].slot = draggingIndex;
                        const items = block.args.items;

                        const di = items.findIndex(i => i.slot === draggingIndex);
                        const ti = items.findIndex(i => i.slot === targetIndex);

                        items[di].slot = targetIndex;
                        items[ti].slot = draggingIndex;
                    }

                    chestMenu(BlockIndex);
                }
            }
        }
        else {
            itemElement.id = `empty${slotIndex}`;
            itemElement.classList.add('empty');
            itemElement.ondragover = e => e.preventDefault();
            itemElement.ondrop = event => {
                event.stopPropagation();
                event.preventDefault();
                if (!event.dataTransfer) throw new Error("Error whilst managing data transfer.");
                const target = event.target as HTMLDivElement;
                const items = block.args.items;
                const draggingIndex = Number(event.dataTransfer.getData('index'));

                items[items.findIndex(i => i.slot == draggingIndex)].slot = Number(target.id.replace('empty', ''));
                chestMenu(BlockIndex);
            }
            itemElement.onclick = e => newItem(e, slotIndex, BlockIndex).toggle(e);
            itemElement.oncontextmenu = e => newItem(e, slotIndex, BlockIndex).toggle(e);
        }

        itemElement.classList.add('item');
        slot.appendChild(itemElement);
    })

    const chestDiv = document.querySelector('div#chest')
    if (chestDiv != null) chestDiv.parentElement!.replaceChild(menuDiv, chestDiv);
    else chest.open();
    return chest;
}
