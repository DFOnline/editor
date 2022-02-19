// Hand coded :>

export interface Template {
    blocks: Block[]
}

export type ItemType = 'txt' | 'num' | 'loc' | 'vec' | 'snd' | 'part' | 'pot' | 'var' | 'g_val'
export type VarScope = "saved" | "unsaved" | "local"
export type g_valSelection = "Selection" | "Default" | "Victim" | "Killer" | "Damager" | "Shooter" | "Projectile" | "LastEntity"

export type ID = "block" | "bracket" | "killable"
export type Inverted = "" | "NOT"
export type Target = "" | "AllPlayers" | "Victim" | "Shooter" | "Damager" | "Killer" | "Default" | "Selection"
export type Direction = "open" | "close"
export type BracketType = "norm" | "repeat"

export type BlockID = BlockActionID | BlockSubActionID | BlockDataID | "else";
export type BlockActionID = "event" | "player_action" | "entity_event" | "entity_action" | "set_var" | "game_action" | "repeat" | "control" | "select_obj" | "else";
export type BlockSubActionID = "if_entity" | "if_game" | "if_player" | "if_var";
export type BlockDataID = "func" | "call_func" | "process" | "start_process";

export interface Block {
    id: ID
    block: BlockID
    action?: string
    data?: string
    target?: Target
    subAction?: string
    inverted?: Inverted
    type?: BracketType
    direct?: Direction
    args: {items:Argument[]}
}

export interface Argument {
    item: Item;
    slot: number;
}

export interface Item {
    id: ItemType
    data: {
        name: string
        scope?: VarScope
        loc?: {
            x: number
            y: number
            z: number
            pitch: number
            yaw: number
        }
        x?: number
        y?: number
        z?: number
        pot?: string
        dur?: number
        amp?: number
        sound?: string
        pitch?: number
        vol?: number
        type?: string
        target?: g_valSelection
    }
}