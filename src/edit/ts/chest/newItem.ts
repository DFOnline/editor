import type { GameValue, Item, Potion, SelectionBlock, Sound, SubActionBlock, Variable, Vector, Location, Text, Number, Particle, ArgumentBlock } from "../../template";
import { code, userMeta } from "../edit";
import chestMenu from "./chestMenu";
import ContextMenu from "../../../main/context";

export default function newItem(event : MouseEvent, slot : number, id : number){
    userMeta.value = slot;

    event.preventDefault();
    event.stopPropagation();

    function icon(icon: string, item: Item) {
        const button = document.createElement('button');
        button.classList.add('newValue');
        button.style.backgroundImage = `url("https://dfonline.dev/public/images/${icon.toUpperCase().replaceAll(' ','_')}.png")`;
        button.onclick = () => {
            const block = code.blocks[id] as ArgumentBlock;
            block.args.items.push({
                slot,
                item,
            });
            Context.close();
            chestMenu(id);
        }
        return button;
    }

    const VariableItem  = icon('magma_cream'     ,{id: 'var'  ,data: {name: 'Variable', scope: 'unsaved'}});
    const TextItem      = icon('book'            ,{id: 'txt'  ,data: {name: '',}});
    const NumberItem    = icon('slime_ball'      ,{id: 'num'  ,data: {name: '0'}});
    const LocationItem  = icon('paper'           ,{id: 'loc'  ,data: {isBlock: false, loc: {x:0,y:0,z:0,pitch:0,yaw:0}}});
    const VectorItem    = icon('prismarine_shard',{id: 'vec'  ,data: {x:0, y:0, z:0}});
    const SoundItem     = icon('nautilus_shell'  ,{id: 'snd'  ,data: {sound: 'Pling', vol: 2, pitch: 1}});
    const ParticleItem  = icon('white_dye'       ,{id: 'part' ,data: {particle: 'Cloud', cluster: {amount: 1, horizontal: 0, vertical: 0}, data: {x:0,y:0,z:0,motionVariation:100}}});
    const GameValueItem = icon('name_tag'        ,{id: 'g_val',data: {target: 'Default', type: 'Health'}});
    const PotionItem    = icon('dragon_breath'   ,{id: 'pot'  ,data: {amp: 0, dur: 1000000, pot: 'Speed'}});


    const menu = document.createElement('div');
    [TextItem,NumberItem,LocationItem,VectorItem,SoundItem,ParticleItem,PotionItem,VariableItem,GameValueItem].forEach(e => {
        menu.append(e);
    });
    menu.style.display = 'flex';
    const Context = new ContextMenu('New Item',[menu]);
    return Context
}