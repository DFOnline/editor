import type { GameValue, Item, Potion, SelectionBlock, Sound, SubActionBlock, Variable, Vector, Location, Text, Number } from "../../template";
import { userMeta } from "../../edit";
import chestMenu from "./chestMenu";
import ContextMenu from "../../../main/context";

export default function newItem(e : MouseEvent, slotID : number, block : SubActionBlock | SelectionBlock, id : number){
    userMeta.value = slotID;

    e.preventDefault();
    e.stopPropagation();

    const workItem = (item : Item) => {
        Context.close();

        block.args.items.push({
            slot: slotID,
            item: item
        });
        const menu = chestMenu(id);

        // setTimeout(() => {
        //     (menu.querySelectorAll('*.slot > .item')[slotID] as HTMLElement).oncontextmenu(e);
        //     setTimeout(() => {
        //         userMeta.ctxKeys['a'].onclick(e);
        //     }, 0);
        // });
    }

    const varItem = document.createElement('button');
    varItem.classList.add('newValue');
    varItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/MAGMA_CREAM.png")';
    varItem.onclick = () => {
        var newItem : Variable = {
            id: 'var',
            data: {
                scope: 'unsaved',
                name: '',
            }
        }
        workItem(newItem);
    }

    const textItem = document.createElement('button');
    textItem.classList.add('newValue');
    textItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/BOOK.png")';
    textItem.onclick = () => {
        var newItem : Text = {
            id: 'txt',
            data: {
                name: '',
            }
        }
        workItem(newItem);
    }

    const numItem = document.createElement('button');
    numItem.classList.add('newValue');
    numItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/SLIME_BALL.png")';
    numItem.onclick = () => {
        var newItem : Number = {
            id: 'num',
            data: {
                name: '',
            }
        }
        workItem(newItem);
    }

    const locItem = document.createElement('button');
    locItem.classList.add('newValue');
    locItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/PAPER.png")';
    locItem.onclick = () => {
        var newItem : Location = {
            id: 'loc',
            data: {
                isBlock: false,
                loc: {
                    x: 0,
                    y: 0,
                    z: 0,
                    pitch: 0,
                    yaw: 0
                },
            }
        }
        workItem(newItem);
    }

    const vecItem = document.createElement('button');
    vecItem.classList.add('newValue');
    vecItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/PRISMARINE_SHARD.png")';
    vecItem.onclick = () => {
        var newItem : Vector = {
            id: 'vec',
            data: {
                x: 0,
                y: 0,
                z: 0,
            }
        }
        workItem(newItem);
    }

    const soundItem = document.createElement('button');
    soundItem.classList.add('newValue');
    soundItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/NAUTILUS_SHELL.png")';
    soundItem.onclick = () => {
        var newItem : Sound = {
            id: 'snd',
            data: {
                sound: '',
                vol: 2,
                pitch: 1,
            }
        }
        workItem(newItem);
    }

    const gameValueItem = document.createElement('button');
    gameValueItem.classList.add('newValue');
    gameValueItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/NAME_TAG.png")';
    gameValueItem.onclick = () => {
        var newItem : GameValue = {
            id: 'g_val',
            data: {
                target: 'Default',
                type: '',
            }
        }
        workItem(newItem);
    }

    const potionItem = document.createElement('button');
    potionItem.classList.add('newValue');
    potionItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/DRAGON_BREATH.png")';
    potionItem.onclick = () => {
        var newItem : Potion = {
            id: 'pot',
            data: {
                amp: 0,
                dur: 1000000,
                pot: 'Speed',
            }
        }
        workItem(newItem);
    }

    const menu = document.createElement('div');
    [varItem,textItem,numItem,locItem,vecItem,soundItem,gameValueItem,potionItem].forEach(e => {
        menu.append(e);
    })
    menu.style.display = 'flex';
    const Context = new ContextMenu('New Item',[menu]);
    return Context
}