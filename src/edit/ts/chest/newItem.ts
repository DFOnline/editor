import type { Item, ArgumentBlock } from "../../template";
import { code, userMeta } from "../edit";
import chestMenu from "./chestMenu";
import ContextMenu from "../../../main/context";

export default function newItem(event: MouseEvent, slot: number, id: number) {
    userMeta.value = slot;

    event.preventDefault();
    event.stopPropagation();

    const menu = document.createElement('div');
    const context = new ContextMenu('New Item', [menu]);

    function icon(icon: string, item: Item) {
        const button = document.createElement('button');
        button.classList.add('newValue');
        button.style.backgroundImage = `url("https://dfonline.dev/public/images/${icon.toUpperCase().replaceAll(' ', '_')}.png")`;
        button.onclick = () => {
            const block = code.blocks[id] as ArgumentBlock;
            block.args.items.push({
                slot,
                item,
            });
            context.close();
            chestMenu(id);
        }
        return button;
    }

    const varItem = icon('magma_cream', { id: 'var', data: { name: 'Variable', scope: 'unsaved' } });
    const txtItem = icon('string', { id: 'txt', data: { name: '', } });
    const compItem = icon('book', { id: 'comp', data: { name: '', } });
    const numItem = icon('slime_ball', { id: 'num', data: { name: '0' } });
    const locItem = icon('paper', { id: 'loc', data: { isBlock: false, loc: { x: 0, y: 0, z: 0, pitch: 0, yaw: 0 } } });
    const vecItem = icon('prismarine_shard', { id: 'vec', data: { x: 0, y: 0, z: 0 } });
    const sndItem = icon('nautilus_shell', { id: 'snd', data: { sound: 'Pling', vol: 2, pitch: 1 } });
    const partItem = icon('white_dye', { id: 'part', data: { particle: 'Cloud', cluster: { amount: 1, horizontal: 0, vertical: 0 }, data: { x: 0, y: 0, z: 0, motionVariation: 100 } } });
    const gvalItem = icon('name_tag', { id: 'g_val', data: { target: 'Default', type: 'Health' } });
    const potItem = icon('dragon_breath', { id: 'pot', data: { amp: 0, dur: 1000000, pot: 'Speed' } });
    const paramItem = icon('ender_eye', { id: 'pn_el', data: { name: 'name', optional: false, plural: false, type: 'num' } })

    menu.append(txtItem, compItem, numItem, locItem, vecItem, sndItem, partItem, document.createElement('br'), potItem, varItem, gvalItem, paramItem);
    menu.style.display = 'flex';
    return context
}
