import { snackbar } from "../../main/main";
import type { BlockID } from "../template";

const ActDB = await fetch(`${sessionStorage.getItem('apiEndpoint')}db`).then(r => r.json()).catch(e => {
    snackbar('An error occured whilst loading required data. Try reloading, this usually fixes itself.', 'error');
    console.error(e);
}) as ActionDump;
export default ActDB;

export interface ActionDump {
    codeblocks: CodeBlock[];
    actions: Action[];
    soundCategories: SoundCategory[];
    sounds: Sound[];
    gameValueCategories: GameValueCategory[];
    gameValues: GameValue[];
    particleCategories: ParticleCategory[];
    particles: Particle[];
    potions: Potion[];
}
export interface CodeBlock {
    name: string;
    identifier: CodeBlockIdentifier;
    item: Icon;
}

export interface Action {
    name: string;
    codeblockName: keyof typeof CodeBlockNameType;
    tags: Tag[];
    aliases: string[];
    icon: Icon;
    subActionBlocks?: subActionBlocks;
}

// huh ??????? what is going on here.
export type subActionBlocks =
    | ['if_player', 'if_var', 'if_game',]
    | ['if_entity', 'if_var', 'if_game',]
    | ['if_player', 'if_entity', 'if_var', 'if_game']


export interface Icon {
    material: string;
    description: string[];
    name: string;
}
export interface Tag {
    name: string;
    options: {
        name: string;
        icon: Icon;
        aliases: unknown[];
    }[]
    defaultOption: string;
    aliases: unknown[];
    slot: number;
}


export interface SoundCategory {
    identifier: string;
    icon: Icon;
    hasSubCategories: boolean;
}

export interface Sound {
    sound: string;
    icon: Icon;
}


export interface GameValueCategory {
    identifier: string;
    guiSlot: number;
    icon: Icon;
}

export interface GameValue {
    aliases: string[];
    category: string;
    icon: Icon;
}


export interface Potion {
    potion: string;
    icon: Icon;
}

export interface ParticleCategory {
    particle: string;
    icon: Icon;
    category: ParticleCategoryName;
    fields: particleField[];
}
export type ParticleCategoryName = 'Ambient Particles' | 'Entity Behavior Particles' | 'Ambient Entity Particles' | 'Entity Attack Particles' | 'Liquid Particles' | 'Ambient Block Particles' | 'Block Behavior Particles'
export type particleField = 'Motion' | 'Motion Variation' | 'Color' | 'Color Variation' | 'Material' | 'Size' | 'Size Variation'

export interface Particle {
    particle: string;
    icon: Icon;
    category: ParticleCategoryName;
    fields: particleField[];
}

export const ItemTypeColors = {
    txt: '#54fcfc',
    comp: '#7fd42a',
    num: '#fb5454',
    loc: '#54fb54',
    vec: '#2affaa',
    snd: '#54fb54',
    part: '#aa55ff',
    pot: '#ff557f',
    item: '#ffaa00',
    any: '#ffd47f',
    var: '#fbfb54',
    list: '#00aa00',
    dict: '#55aaff',
    g_val: '#ffd47f',
    bl_tag: '#fbfb54',
    pn_el: '#aaffaa',
} as const
export const ItemTypeNames = {
    txt: 'String',
    comp: 'Text',
    num: 'Number',
    loc: 'Location',
    vec: 'Vector',
    snd: 'Sound',
    part: 'Particle',
    pot: 'Potion',
    item: 'Item',
    any: 'Any Value',
    var: 'Variable',
    list: 'List',
    dict: 'Dictionary',
    g_val: 'Game Value',
    pn_el: 'Parameter'
} as const
export const ParameterTypes = ['txt','comp','num','loc','vec','snd','part','pot','item', 'any','var','list','dict'] as const
export type ParameterTypesType = typeof ParameterTypes[number];

export type CodeBlockIdentifier = BlockID;
export type CodeBlockName = "PLAYER ACTION" | "IF PLAYER" | "START PROCESS" | "CALL FUNCTION" | "CONTROL" | "SET VARIABLE" | "ENTITY EVENT" | "PLAYER EVENT" | "FUNCTION" | "IF ENTITY" | "ENTITY ACTION" | "IF VARIABLE" | "SELECT OBJECT" | "GAME ACTION" | "ELSE" | "PROCESS" | "REPEAT" | "IF GAME";
export enum CodeBlockTypeName { player_action = "PLAYER ACTION", if_player = "IF PLAYER", start_process = "START PROCESS", call_func = "CALL FUNCTION", control = "CONTROL", set_var = "SET VARIABLE", entity_event = "ENTITY EVENT", event = "PLAYER EVENT", func = "FUNCTION", if_entity = "IF ENTITY", entity_action = "ENTITY ACTION", if_var = "IF VARIABLE", select_obj = "SELECT OBJECT", game_action = "GAME ACTION", else = "ELSE", process = "PROCESS", repeat = "REPEAT", if_game = "IF GAME" }
export enum CodeBlockNameType { "PLAYER ACTION" = 'player_action', "IF PLAYER" = 'if_player', "START PROCESS" = 'start_process', "CALL FUNCTION" = 'call_func', "CONTROL" = 'control', "SET VARIABLE" = 'set_var', "ENTITY EVENT" = 'entity_event', "PLAYER EVENT" = 'event', "FUNCTION" = 'func', "IF ENTITY" = 'if_entity', "ENTITY ACTION" = 'entity_action', "IF VARIABLE" = 'if_var', "SELECT OBJECT" = 'select_obj', "GAME ACTION" = 'game_action', "ELSE" = 'else', "PROCESS" = 'process', "REPEAT" = 'repeat', "IF GAME" = 'if_game' }
