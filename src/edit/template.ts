import { decodeTemplate } from "../main/main"

export interface Template {
    blocks: Block[]
}

export type ItemType = 'txt' | 'num' | 'loc' | 'vec' | 'snd' | 'part' | 'pot' | 'var' | 'g_val'
export type VarScope = "saved" | "unsaved" | "local"
export type g_valSelection = "Selection" | "Default" | "Victim" | "Killer" | "Damager" | "Shooter" | "Projectile" | "LastEntity"
export const SelectionValues : Target[] = ["", "AllPlayers", "Selection", "Default", "Victim", "Killer", "Damager", "Shooter", "Projectile", "LastEntity"]

export type ID = "block" | "bracket" | "killable"
export type Inverted = "" | "NOT" // funny
export type Target = "" | "AllPlayers" | "Victim" | "Shooter" | "Damager" | "Killer" | "Default" | "Selection" | "Projectile" | "LastEntity"
export type Direction = "open" | "close"
export type BracketType = "norm" | "repeat"

export type BlockID = BlockActionID | BlockSubActionID | BlockDataID | "else";
export type BlockActionID = "event" | "player_action" | "entity_event" | "entity_action" | "set_var" | "game_action" | "repeat" | "control" | "select_obj";
export const SelectionBlocks : BlockID[] = ["player_action", "entity_event", "entity_action", "if_entity", "if_player"]
export type BlockSubActionID = "if_entity" | "if_game" | "if_player" | "if_var";
export type BlockDataID = "func" | "call_func" | "process" | "start_process";

export type Block = PhysicalBlock | Killable // + Killable type, used in filtering.
export type PlacedBlock = SelectionBlock | SubActionBlock | DataBlock | Else // All the types you place
export type PhysicalBlock = PlacedBlock | Bracket // All the types we use

export interface Bracket {
    id: "bracket";
    type: "norm" | "repeat";
    direct: "open" | "close";
}

export interface SelectionBlock {
    id: "block";
    block: BlockActionID
    action: string;
    target: Target;
    inverted: Inverted;
    args: {items: Argument[]}
}

export interface SubActionBlock {
    id: "block";
    block: BlockSubActionID
    action: string;
    subAction: string;
    inverted: Inverted;
    args: {items: Argument[]}
}

export interface DataBlock {
    id: "block";
    block: BlockDataID;
    data: string;
}

export interface Else {
    id: "block";
    block: "else"; // 💀
}

export interface Killable {
    id: 'killable';
}

export interface Argument<i = Item> {
    item: i;
    slot: number;
}


// Item Code ========================================================

export interface Item {
    id: string;
    data: any
}

// export type Item = Number | Text | Variable | Location | Vector | Potion | Sound | GameValue | Particle | BlockTag | ChestItem

export interface Number extends Item {
    id: 'num';
    data: {
        name: string;
    }
}

export interface Text extends Item {
    id: 'txt';
    data: {
        name: string;
    }
}

export interface Variable extends Item {
    id: 'var'
    data: {
        name: string;
        scope: VarScope;
    }
}

export interface Location extends Item {
    id: 'loc';
    data: {
        isBlock: boolean;
        loc: {
            x: number
            y: number
            z: number
            pitch: number
            yaw: number
        }
    }
}

export interface Vector extends Item {
    id: 'vec';
    data: {
        x: number;
        y: number;
        z: number;
    }
}

export interface Potion extends Item {
    id: 'pot';
    data: {
        pot: string;
        dur: number;
        amp: number;
    }
}

export interface Sound extends Item {
    id: 'snd';
    data: {
        sound: string
        pitch: number
        vol: number
    }
}

export interface GameValue extends Item {
    id: 'g_val';
    data: {
        type: string;
        target: g_valSelection;
    }
}

export interface Particle extends Item {
    id: 'part';
    data: {
        particle: string
        cluster: {
            amount: number;
            horizontal: number;
            vertical: number;
        }
        data: {
            motionVariation?: number;
            x?: number;
            y?: number;
            z?: number;
            colorVariation?: number;
            rgb?: number;
            sizeVariation?: number;
            size?: number;
            material?: string;
        }
    }
}

export interface BlockTag extends Item {
    id: 'bl_tag';
    data: {
        option: string;
        tag: string;
        action: string;
        block: BlockID;
    }
}

export interface ChestItem extends Item {
    id: 'item';
    data: {
        item: string;
    }
}

// copilot just generating minecraft stuff.
export interface ParsedItem {
    name: string;
    id: string;
    Count: NbtValue<number>;
    tag: {
        display?: {
            Name: string;
            Lore: string[];
        },
        enchantments?: {
            [key: string]: {
                id: number | string;
                lvl: number;
            };
        },
        unbreakable?: boolean;
        hideFlags?: number;
        attributes?: {
            [key: string]: {
                name: string;
                value: string;
                slot: string;
                id: string;
            };
        };
    }
}
export interface NbtValue<t> {
    value: t;
}


export async function loadTemplate(data : string){
    if(data.match(/^H4sIA*[0-9A-Za-z+/]*={0,2}$/)){
        return decodeTemplate(data)
    }
    else {
        const res = await fetch(`${window.sessionStorage.getItem('apiEndpoint')}save/${data.replace(/^dfo:/,'')}`);
        const json = await res.json();
        return decodeTemplate(json.data);
    }
}