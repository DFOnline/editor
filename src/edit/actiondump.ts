export interface ActionDump {
    codeblocks: CodeBlock[]
    actions: Action[]
}
export default ActionDump
export interface CodeBlock {
    name: string;
    identifier: CodeBlockIdentifier;
}

export interface Action {
    name: string;
    codeblockName: string;
    tags: Tag[]
    icon: Icon
}

export interface Icon {
    material: string;
    description: string;
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

export type CodeBlockIdentifier = "player_action" | "if_player" | "start_process" | "call_func" | "control" | "set_var" | "entity_event" | "event" | "func" | "if_entity" | "entity_action" | "if_var" | "select_obj" | "game_action" | "else" | "process" | "repeat" | "if_game";
export type CodeBlockName = "PLAYER ACTION" | "IF PLAYER" | "START PROCESS" | "CALL FUNCTION" | "CONTROL" | "SET VARIABLE" | "ENTITY EVENT" | "PLAYER EVENT" | "FUNCTION" | "IF ENTITY" | "ENTITY ACTION" | "IF VARIABLE" | "SELECT OBJECT" | "GAME ACTION" | "ELSE" | "PROCESS" | "REPEAT" | "IF GAME";
export enum CodeBlockTypeName {player_action = "PLAYER ACTION", if_player = "IF PLAYER", start_process = "START PROCESS", call_func = "CALL FUNCTION", control = "CONTROL", set_var = "SET VARIABLE", entity_event = "ENTITY EVENT", event = "PLAYER EVENT", func = "FUNCTION", if_entity = "IF ENTITY", entity_action = "ENTITY ACTION", if_var = "IF VARIABLE", select_obj = "SELECT OBJECT", game_action = "GAME ACTION", else = "ELSE", process = "PROCESS", repeat = "REPEAT", if_game = "IF GAME"}