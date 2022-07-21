import type { BlockID } from "../template";

export interface ActionDump {
    codeblocks: CodeBlock[];
    actions: Action[];
    soundCategories: SoundCategory[];
    sounds: Sound[];
    gameValueCategories: GameValueCategory[];
    gameValues: GameValue[];
    particleCategories: ParticleCategory[];
    potions: Potion[];
}
export default ActionDump
export interface CodeBlock {
    name: string;
    identifier: CodeBlockIdentifier;
    item: Icon;
}

export interface Action {
    name: string;
    codeblockName: string;
    tags: Tag[];
    icon: Icon;
    subActionBlocks?: subActionBlocks;
}

type subActionBlocks = 
    ['if_player', 'if_var', 'if_game',] |
    ['if_entity', 'if_var', 'if_game',] |
    ['if_player', 'if_entity', 'if_var', 'if_game']


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
        alaises: Array<any>
    }[]
    defaultOption: string;
    alaises: Array<any>
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

export type CodeBlockIdentifier = BlockID;
export type CodeBlockName = "PLAYER ACTION" | "IF PLAYER" | "START PROCESS" | "CALL FUNCTION" | "CONTROL" | "SET VARIABLE" | "ENTITY EVENT" | "PLAYER EVENT" | "FUNCTION" | "IF ENTITY" | "ENTITY ACTION" | "IF VARIABLE" | "SELECT OBJECT" | "GAME ACTION" | "ELSE" | "PROCESS" | "REPEAT" | "IF GAME";
export enum CodeBlockTypeName {player_action = "PLAYER ACTION", if_player = "IF PLAYER", start_process = "START PROCESS", call_func = "CALL FUNCTION", control = "CONTROL", set_let = "SET VARIABLE", entity_event = "ENTITY EVENT", event = "PLAYER EVENT", func = "FUNCTION", if_entity = "IF ENTITY", entity_action = "ENTITY ACTION", if_let = "IF VARIABLE", select_obj = "SELECT OBJECT", game_action = "GAME ACTION", else = "ELSE", process = "PROCESS", repeat = "REPEAT", if_game = "IF GAME"}