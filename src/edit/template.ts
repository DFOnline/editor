// Hand coded :>

export interface Template {
    blocks: Block[]
}

export type ItemType = 'txt' | 'num' | 'loc' | 'vec' | 'snd' | 'part' | 'pot' | 'var' | 'g_val'

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
    }
}