import type { GameValue, Item, Potion, SelectionBlock, Sound, SubActionBlock, Variable, Vector, Location, Text, Number, Particle } from "../../template";
import { userMeta } from "../edit";
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

    const VariableItem = document.createElement('button');
    VariableItem.classList.add('newValue');
    VariableItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/MAGMA_CREAM.png")';
    VariableItem.onclick = () => {
        let newItem : Variable = {
            id: 'var',
            data: {
                scope: 'unsaved',
                name: '',
            }
        }
        workItem(newItem);
    }

    const TextItem = document.createElement('button');
    TextItem.classList.add('newValue');
    TextItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/BOOK.png")';
    TextItem.onclick = () => {
        let newItem : Text = {
            id: 'txt',
            data: {
                name: '',
            }
        }
        workItem(newItem);
    }

    const NumberItem = document.createElement('button');
    NumberItem.classList.add('newValue');
    NumberItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/SLIME_BALL.png")';
    NumberItem.onclick = () => {
        let newItem : Number = {
            id: 'num',
            data: {
                name: '',
            }
        }
        workItem(newItem);
    }

    const LocationItem = document.createElement('button');
    LocationItem.classList.add('newValue');
    LocationItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/PAPER.png")';
    LocationItem.onclick = () => {
        let newItem : Location = {
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

    const VectorItem = document.createElement('button');
    VectorItem.classList.add('newValue');
    VectorItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/PRISMARINE_SHARD.png")';
    VectorItem.onclick = () => {
        let newItem : Vector = {
            id: 'vec',
            data: {
                x: 0,
                y: 0,
                z: 0,
            }
        }
        workItem(newItem);
    }

    const SoundItem = document.createElement('button');
    SoundItem.classList.add('newValue');
    SoundItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/NAUTILUS_SHELL.png")';
    SoundItem.onclick = () => {
        let newItem : Sound = {
            id: 'snd',
            data: {
                sound: 'Pling',
                vol: 2,
                pitch: 1,
            }
        }
        workItem(newItem);
    }

    const ParticleItem = document.createElement('button');
    ParticleItem.classList.add('newValue');
    ParticleItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/WHITE_DYE.png")';
    ParticleItem.onclick = () => {
        let newItem : Particle = {
            id: 'part',
            data: {
                particle: 'Cloud',
                cluster: {
                    amount: 1,
                    horizontal: 0,
                    vertical: 0,
                },
                data: {
                    x: 1,
                    y: 0,
                    z: 0,
                    motionVariation: 100,
                }
            }
        }
        workItem(newItem);
    }

    const GameValueItem = document.createElement('button');
    GameValueItem.classList.add('newValue');
    GameValueItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/NAME_TAG.png")';
    GameValueItem.onclick = () => {
        let newItem : GameValue = {
            id: 'g_val',
            data: {
                target: 'Default',
                type: '',
            }
        }
        workItem(newItem);
    }

    const PotionItem = document.createElement('button');
    PotionItem.classList.add('newValue');
    PotionItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/DRAGON_BREATH.png")';
    PotionItem.onclick = () => {
        let newItem : Potion = {
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
    [TextItem,NumberItem,LocationItem,VectorItem,SoundItem,ParticleItem,PotionItem,VariableItem,GameValueItem].forEach(e => {
        menu.append(e);
    })
    menu.style.display = 'flex';
    const Context = new ContextMenu('New Item',[menu]);
    return Context
}