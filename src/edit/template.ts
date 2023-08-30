import { decodeTemplate } from "../main/main"
import { ParameterTypesType } from "./ts/actiondump";

export interface Template {
    blocks: Block[]
}

export type ItemType = 'txt' | 'num' | 'loc' | 'vec' | 'snd' | 'part' | 'pot' | 'var' | 'g_val'
export type VarScope = keyof typeof SCOPE_TO_NAME_MAP;
export const SCOPE_TO_NAME_MAP = { saved: "SAVED", unsaved: "GAME", local: "LOCAL" } as const;
export enum ScopeName {
    saved = "SAVED",
    unsaved = "GAME",
    local = "LOCAL"

}
export type GvalSelection = "Selection" | "Default" | "Victim" | "Killer" | "Damager" | "Shooter" | "Projectile" | "LastEntity"
export const SELECTION_VALUES = ["", "AllPlayers", "Selection", "Default", "Victim", "Killer", "Damager", "Shooter", "Projectile", "LastEntity"] as const;

export type ID = "block" | "bracket" | "killable"
export type Inverted = "" | "NOT" // funny
export type Target = "" | "AllPlayers" | "Victim" | "Shooter" | "Damager" | "Killer" | "Default" | "Selection" | "Projectile" | "LastEntity"
export type Direction = "open" | "close"
export type BracketType = "norm" | "repeat"

export type BlockID = BlockActionID | BlockSubActionID | BlockDataID | "else";
export type BlockActionID = "event" | "player_action" | "entity_event" | "entity_action" | "set_var" | "game_action" | "if_game" | "control" | "if_entity" | "if_player" | "if_var";
export type BlockSubActionID = (typeof SUBACTION_BLOCKS)[number];
export type BlockDataID = (typeof DATA_BLOCKS)[number];

export const SELECTION_BLOCKS = ["player_action", "entity_event", "entity_action", "if_entity", "if_player"] as const;
export const SUBACTION_BLOCKS = ["repeat", "select_obj"] as const;
export const DATA_BLOCKS = ["call_func", "func", "process", "start_process"] as const;

export const DEFAULT_DATA_BLOCKS_TAGS: Record<BlockDataID, { item: { id: "bl_tag", data: { option: string, tag: string, action: string, block: string } }, slot: number }[]> = {
    func: [{ item: { id: "bl_tag", data: { option: "False", tag: "Is Hidden", action: "dynamic", block: "func" } }, slot: 26 }],
    call_func: [],
    process: [{ item: { id: "bl_tag", data: { option: "False", tag: "Is Hidden", action: "dynamic", block: "process" } }, slot: 26 }],
    start_process: [{ item: { id: "bl_tag", data: { option: "Don't copy", tag: "Local Variables", action: "dynamic", block: "start_process" } }, slot: 25 }, { item: { id: "bl_tag", data: { option: "With current targets", tag: "Target Mode", action: "dynamic", block: "start_process" } }, slot: 26 }]
};

/** Everything that can be in the array. Killable is used for filtering. */
export type Block = PhysicalBlock | Killable
/** All types placed by the player */
export type PlacedBlock = ArgumentBlock | DataBlock | Else
/** All the types with arguments */
export type ArgumentBlock = SelectionBlock | SubActionBlock
/** All types that appear in the codespace */
export type PhysicalBlock = PlacedBlock | Bracket

export enum VarScopeEnum {
    local = "LOCAL",
    saved = "SAVED",
    unsaved = "GAME",
}

export enum VarScopeColor {
    local = '#55FF55',
    saved = '#FFFF55',
    unsaved = '#AAAAAA',
}

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
    args: { items: Argument<Item>[] }
}

export interface SubActionBlock {
    id: "block";
    block: BlockSubActionID
    action: string;
    subAction: string;
    inverted: Inverted;
    args: { items: Argument<Item>[] }
}

export interface DataBlock {
    id: "block";
    block: BlockDataID;
    data: string;
    args: { items: Argument<Item>[] }
}

export interface Else {
    id: "block";
    block: "else"; // 💀 xd
}

export interface Killable {
    id: 'killable';
}

export interface Argument<i extends Item> {
    item: i;
    slot: number;
}

// Item Code ========================================================

export type DefinedItems = NumberVal | Text | Component | Variable | Location | Vector | Potion | Sound | GameValue | Particle | BlockTag | ChestItem | Parameter
export type Item = UndefinedItem | DefinedItems;

export interface NumberVal {
    id: 'num';
    data: {
        name: string;
    }
}

export interface Text {
    id: 'txt';
    data: {
        name: string;
    }
}

/**
 * Rich Text/Styled Text
 */
export interface Component {
    id: 'comp';
    data: {
        name: string;
    }
}

export interface Variable {
    id: 'var'
    data: {
        name: string;
        scope: VarScope;
    }
}

export interface Location {
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

export interface Vector {
    id: 'vec';
    data: {
        x: number;
        y: number;
        z: number;
    }
}

export interface Potion {
    id: 'pot';
    data: {
        pot: string;
        dur: number;
        amp: number;
    }
}

export interface Sound {
    id: 'snd';
    data: {
        sound: string
        pitch: number
        vol: number
    }
}

export interface GameValue {
    id: 'g_val';
    data: {
        type: string;
        target: GvalSelection;
    }
}

export interface Particle {
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

export interface BlockTag {
    id: 'bl_tag';
    data: {
        option: string;
        tag: string;
        action: string;
        block: BlockID;
        variable?: Variable;
    }
}

export interface ChestItem {
    id: 'item';
    data: {
        item: string;
    }
}

export interface Parameter {
    id: 'pn_el';
    data: {
        name: string;
        type: ParameterTypesType;
        plural: boolean;
        optional: boolean;
        default_value?: DefinedItems;
    }
}

export interface UndefinedItem {
    id: string;
    data: any;
}

// copilot just generating minecraft stuff.
export interface ParsedItem {
    id: string;
    Count: NbtValue<number>;
    tag: {
        display?: {
            Name: string;
            Lore: string[];
        },
        enchantments?: Record<string, { id: number | string; lvl: number; }>;
    },
    unbreakable?: boolean;
    hideFlags?: number;
    attributes?: Record<string, {
        name: string;
        value: string;
        slot: string;
        id: string;
    }>
}
export interface NbtValue<t> {
    value: t;
}

export async function loadTemplate(data: string) {
    if (data.match(/^H4sIA*[0-9A-Za-z+/]*={0,2}$/)) {
        return decodeTemplate(data)
    }
    else {
        const res = await fetch(`${window.sessionStorage.getItem('apiEndpoint')}save/${data.replace(/^dfo:/, '')}`);
        const json = await res.json();
        return decodeTemplate(json.data);
    }
}
