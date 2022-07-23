import chestMenu from "../chestMenu";
import { ArgumentBlock, Item, Number, ScopeToName, Text, Variable, VarScope, Location } from "../../../template";
import ContextMenu from "../../../../main/context";
import { code } from "../../edit";
import { minecraftColorHTML } from "../../../../main/main";

export default abstract class ChestItem {
    backgroundUrl : string;
    item : Item;

    abstract movable : boolean;

    constructor(item : Item){
        this.item = item;
    }


    abstract contextMenu(Block : number,Slot : number) : ContextMenu;

    /**
     * Get the representation of the item as a HTML element.
     */
    abstract icon() : HTMLDivElement;

    /**
     * A HTML div with all the tooltip information.
     */
    abstract tooltip() : HTMLDivElement;

    /**
     * Returns the data in the item as a human readable string.
     */
    abstract repr() : string;

    /**
     * Dynamically get the item based of it's type.
     * @param item The item to parse.
     * @returns Any type of item, matching the type of the item.
     */
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

    contextMenu(_Block : number, _Slot: number): ContextMenu {
        return new ContextMenu('Unknown',[],true);
    }

    icon(){
        const itemElement = document.createElement('div');

        itemElement.style.backgroundImage = `url(${this.backgroundUrl})`;
        itemElement.classList.add('fadepulse');

        return itemElement
    }

    tooltip(){
        const tooltip = document.createElement('div');
        tooltip.innerText = `This item couldn't be parsed.`;
        tooltip.style.color = '#ff0000';
        return tooltip;
    }

    repr(): string {
        return `unkown ${this.item}`;
    }
}

/** This is for use in the click event. */
function deleteItem(Block : number, Slot : number, ctxBox : ContextMenu){
    const block = code.blocks[Block] as ArgumentBlock;
    const index = block.args.items.findIndex(slot => slot.slot === Slot);
    block.args.items.splice(index,1);
    chestMenu(Block);
    ctxBox.close();
}
/** This if for use in the keydown event */
function nameEditor(item: any, Slot: number, event: KeyboardEvent, value: HTMLInputElement, ctxBox: ContextMenu){
    if(event.key === 'Enter'){
        item.data.name = value.value;
        chestMenu(Slot);
        ctxBox.close();
    }
    if(event.key === 'Escape'){
        ctxBox.close();
    }
}
/** To be returned in icon */
function genericIcon(backgroundUrl : string){
    const itemElement = document.createElement('div');
    itemElement.style.backgroundImage = `url(${backgroundUrl})`;
    return itemElement
}

export class Num extends ChestItem {
    backgroundUrl = 'https://dfonline.dev/public/images/SLIME_BALL.png';
    item : Number;

    movable = true;

    constructor(item : Number){
        super(item);
    }

    contextMenu(Block: number, Slot: number): ContextMenu {
        const value = document.createElement('input');

        value.value = this.item.data.name;
        value.onkeydown = e => nameEditor(this.item, Slot, e, value, ctxBox);
        value.onclick = e => e.stopPropagation();

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteItem(Block,Slot,ctxBox);

        const ctxBox = new ContextMenu('Number',[value,deleteButton]);
        return ctxBox;
    }

    icon(){
        const itemElement = document.createElement('div');
        
        itemElement.style.backgroundImage = `url(${this.backgroundUrl})`;
        const count = document.createElement('span');
        count.innerText = this.item.data.name;
        count.style.color = "rgb(255, 85, 85)"
        itemElement.append(count);

        // // when the user uses the scroll wheel
        // itemElement.onwheel = e => {
        //     const count = parseInt(this.item.data.name);
        //     if(!isNaN(count)){
        //         if(e.deltaY < 0){
        //             this.item.data.name = (count + 1).toString();
        //         }
        //         if(e.deltaY > 0){
        //             this.item.data.name = (count - 1).toString();
        //         }
        //     }
        // }

        return itemElement
    }

    tooltip(): HTMLDivElement {
        const tooltip = document.createElement('div');
        tooltip.innerText = `${this.item.data.name}`;
        tooltip.style.color = 'rgb(255, 85, 85)';
        return tooltip;
    }

    repr(): string {
        return `num ${this.item.data.name}`;
    }
}

export class Txt extends ChestItem {
    backgroundUrl = 'https://dfonline.dev/public/images/BOOK.png';
    item : Text;

    movable = true;

    constructor(item : Text){
        super(item);
    }

    contextMenu(Block: number, Slot: number): ContextMenu {
        const value = document.createElement('input');

        value.value = this.item.data.name;
        value.onkeydown = e => nameEditor(this.item,Slot,e,value,ctxBox);
        value.onclick = e => e.stopPropagation();

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteItem(Block,Slot,ctxBox);

        const ctxBox = new ContextMenu('Text',[value,deleteButton]);
        return ctxBox;
    }

    icon(){
        return genericIcon(this.backgroundUrl);
    }

    tooltip(): HTMLDivElement {
        const tooltip = document.createElement('div');
        minecraftColorHTML(this.item.data.name).forEach(color => tooltip.append(color));
        return tooltip;
    }

    repr(): string {
        return `txt ${this.item.data.name.replace('\n','\\n')}`;
    }
}

export class Var extends ChestItem {
    backgroundUrl = 'https://dfonline.dev/public/images/MAGMA_CREAM.png';
    item : Variable;

    movable = true;

    constructor(item : Variable){
        super(item);
    }

    contextMenu(Block: number, Slot: number): ContextMenu {
        const value = document.createElement('input');

        value.value = this.item.data.name;
        value.onkeydown = e => nameEditor(this.item,Slot,e,value,ctxBox);
        value.onclick = e => e.stopPropagation();

        const scope = document.createElement('select');
        scope.onchange = () => {this.item.data.scope = scope.value as VarScope; chestMenu(Slot);};
        scope.value = this.item.data.scope;
        scope.onclick = e => e.stopPropagation();
        scope.innerHTML = `
        <option value="unsaved">GAME</option>
        <option value="saved">SAVED</option>
        <option value="local">LOCAL</option>
        `;


        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteItem(Block,Slot,ctxBox);

        const ctxBox = new ContextMenu('Var',[value,scope,deleteButton]);
        return ctxBox;
    }

    colors = {'local':'#55FF55','saved':'#FFFF55','unsaved':'#AAAAAA'}

    icon(){
        const itemElement = document.createElement('div');
        itemElement.style.backgroundImage = `url(${this.backgroundUrl})`;
        const scope = document.createElement('span');
        scope.innerText = ScopeToName[this.item.data.scope].substring(0,1);
        scope.style.color = this.colors[this.item.data.scope];
        itemElement.append(scope);
        return itemElement
    }

    tooltip(): HTMLDivElement {
        const tooltip = document.createElement('div');
        tooltip.innerText = `${this.item.data.name}`;
        const scope = document.createElement('span');
        scope.innerText = ScopeToName[this.item.data.scope];
        scope.style.color = this.colors[this.item.data.scope];
        tooltip.append(document.createElement('br'),scope);
        return tooltip;
    }

    repr(): string {
        return `var ${this.item.data.name}`;
    }
}

export class Loc extends ChestItem {
    backgroundUrl = 'https://dfonline.dev/public/images/PAPER.png';
    item : Location;

    movable = true;

    constructor(item : Location){
        super(item);
    }

    contextMenu(Block: number, Slot: number): ContextMenu {
        const x = document.createElement('input');
        const y = document.createElement('input');
        const z = document.createElement('input');
        const pitch = document.createElement('input');
        const yaw = document.createElement('input');

        x.type = 'number';
        y.type = 'number';
        z.type = 'number';
        pitch.type = 'number';
        yaw.type = 'number';

        x.value = this.item.data.loc.x.toString();
        y.value = this.item.data.loc.y.toString();
        z.value = this.item.data.loc.z.toString();
        pitch.value = this.item.data.loc.pitch.toString();
        yaw.value = this.item.data.loc.yaw.toString();

        x.onchange = e => locationEditor(this.item,Slot,e,x,y,z,pitch,yaw,ctxBox);
        y.onchange = e => locationEditor(this.item,Slot,e,x,y,z,pitch,yaw,ctxBox);
        z.onchange = e => locationEditor(this.item,Slot,e,x,y,z,pitch,yaw,ctxBox);
        pitch.onchange = e => locationEditor(this.item,Slot,e,x,y,z,pitch,yaw,ctxBox);
        yaw.onchange = e => locationEditor(this.item,Slot,e,x,y,z,pitch,yaw,ctxBox);

        x.onclick = e => e.stopPropagation();
        y.onclick = e => e.stopPropagation();
        z.onclick = e => e.stopPropagation();
        pitch.onclick = e => e.stopPropagation();
        yaw.onclick = e => e.stopPropagation();

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteItem(Block,Slot,ctxBox);

        const ctxBox = new ContextMenu('Loc',[x,y,z,pitch,yaw,deleteButton]);
        return ctxBox;
    }

    icon(){
        return genericIcon(this.backgroundUrl);
    }

    tooltip(): HTMLDivElement {
        const tooltip = document.createElement('div');
        const title = document.createElement('span');
        title.innerText = 'Location';
        title.style.color = '#55FF55';
        tooltip.append(title);
        tooltip.append(document.createElement('br'));
        const x = document.createElement('span');
        x.innerText = `X: ${this.item.data.loc.x}`;
        const y = document.createElement('span');
        y.innerText = `Y: ${this.item.data.loc.y}`;
        const z = document.createElement('span');
        z.innerText = `Z: ${this.item.data.loc.z}`;
        const pitch = document.createElement('span');
        pitch.innerText = `p: ${this.item.data.loc.pitch}`;
        const yaw = document.createElement('span');
        yaw.innerText = `y: ${this.item.data.loc.yaw}`;
        tooltip.append(x,document.createElement('br'),y,document.createElement('br'),z,document.createElement('br'),pitch,document.createElement('br'),yaw);
        return tooltip;
    }

    repr(): string {
        return `loc [${this.item.data.loc.x},${this.item.data.loc.y},${this.item.data.loc.z},${this.item.data.loc.pitch},${this.item.data.loc.yaw}]`;
    }
}
function locationEditor(item : Location,Slot: number,e: Event,lx: HTMLInputElement,ly: HTMLInputElement,lz: HTMLInputElement,lpitch: HTMLInputElement,lyaw: HTMLInputElement,ctxBox: ContextMenu){
    const x = parseFloat(lx.value);
    const y = parseFloat(ly.value);
    const z = parseFloat(lz.value);
    const pitch = parseFloat(lpitch.value);
    const yaw = parseFloat(lyaw.value);
    if(!isNaN(x) && !isNaN(y) && !isNaN(z) && !isNaN(pitch) && !isNaN(yaw)){
        item.data.loc.x = x;
        item.data.loc.y = y;
        item.data.loc.z = z;
        item.data.loc.pitch = pitch;
        item.data.loc.yaw = yaw;
        chestMenu(Slot);
    }
}

/* 
TODO: Vector
TODO: Potion
TODO: Sound
TODO: Game Value
TODO: Particle
TODO: Items
TODO: Block Tags
*/

function getItem(item : Item){
    switch(item.id){
        case 'num': return new Num(item);
        case 'txt': return new Txt(item);
        case 'var': return new Var(item);
        case 'loc': return new Loc(item);
        default: return new UnknownItem(item);
    }
}