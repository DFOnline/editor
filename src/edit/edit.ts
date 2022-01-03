import { startup, decode } from "../main/main";

let dragging: {"type":'block'|undefined, "value":any|undefined} = {"type":undefined,"value":undefined}
let code: {"blocks":DFblock[]} = {"blocks":[]};
const NAMES = {
    "player_action": "PLAYER ACTION",
    "if_player": "IF PLAYER",
    "start_process": "START PROCESS",
    "call_func": "CALL FUNCTION",
    "control": "CONTROL",
    "set_var": "SET VARIABLE",
    "entity_event": "ENTITY EVENT",
    "event": "PLAYER EVENT",
    "func": "FUNCTION",
    "if_entity": "IF ENTITY",
    "entity_action": "ENTITY ACTION",
    "if_var": "IF VARIABLE",
    "select_obj": "SELECT OBJECT",
    "game_action": "GAME ACTION",
    "else": "ELSE",
    "process": "PROCESS",
    "repeat": "REPEAT",
    "if_game": "IF GAME",
    'loader': 'LOADER',
    'call_loader': 'BEGIN LOADER'
}
type blockMaterial = "player_action" | "if_player" | "start_process" | "call_func" | "control" | "set_var" | "entity_event" | "event" | "func" | "if_entity" | "entity_action" | "if_var" | "select_obj" | "game_action" | "else" | "process" | "repeat" | "if_game" | 'loader' | 'call_loader';
interface DFblock {id: "block" | "bracket" | "killable", 'block': blockMaterial, direct: "open" | "close", type: "norm" | "repeat", action: string, data: string, target : string, subAction : string, inverted : "NOT" | "" | undefined}

window.onload = () => {
    startup()
    if(sessionStorage.getItem('import')){
        code = JSON.parse(decode(sessionStorage.getItem('import')))
    }
    rendBlocks();
}
function rendBlocks(){ // look at this mess // on second thoughts don't, is even painfull for me to look at. // on third thoughts you can collapse most of the painfull stuff I never wish to look at again.
    var codeSpace = document.getElementById('codeBlocks') as HTMLDivElement;
    var messages = ["Boo.", "Boo, again!", "Hello.", "Hello!", "Call me bob the comment?", "Nice to meet you.", "GeorgeRNG :D", "What did the farmer say when he lost his tractor? Where's my tractor?", "Beyond that.", "Maybe it's gold.", "Au-.","The Moss.","Procrastination.","Typing Error"];
    codeSpace.innerHTML = `<!-- ${messages[Math.floor(Math.random() * messages.length)]} -->`; // hi
    code.blocks.forEach((block,i) => {
        console.log(block);
        var blockDiv = document.createElement('div');
        blockDiv.classList.add('block');
        blockDiv.id = 'block' + String(i);
        blockDiv.draggable = true;
        blockDiv.ondrag = () => {dragging.type = 'block',dragging.value = i}
        blockDiv.ondragover = e => {if(dragging.type === 'block'){e.preventDefault()}};
        blockDiv.addEventListener('drop',e => { // pain // it doesn't even seem to work..

            var HTMLblock = backup(e.target as HTMLElement); // the block html element
            var {x:posX,width} = HTMLblock.getBoundingClientRect(); // x on screen as posX and witdh
            var data = JSON.parse((JSON.stringify(code.blocks[dragging.value]))) as Readonly<DFblock>; // get the block
            code.blocks[dragging.value]['id'] = 'killable'; // mark thing for deletion
            var id = (Number(HTMLblock.id.replace('block',''))); // numerical id of the block dropped on
            code.blocks.splice((id + Number(e.clientX > (width / 2) + posX)),0,data); // splice it in
            code.blocks = code.blocks.filter(y => y.id !== "killable"); // remove the one marked for deletion

            rendBlocks();

        }); // why doesn't it exist add HTMLElement.drop??
        var stack = document.createElement('div');
        var topper = document.createElement('div');
        var blockElement = document.createElement('div');
        if(block.id === "block"){
            topper.classList.add(['player_action','if_player','process','start_process','func','entity_action','if_entity','repeat','set_var','if_var','control','select_obj',"loader","call_loader"].includes(block.block) ? 'chest' : 'air');
            blockElement.classList.add(block.block, 'mat');
            if(block.block !== "else"){
                var sign = document.createElement('div');
                sign.classList.add('sign');
                var name = document.createElement('span');
                name.innerText = NAMES[block.block];
                sign.append(name);
                var action = document.createElement('span');
                action.innerText = block.block === "call_func" || block.block === "func" || block.block === "process" || block.block === "start_process" ? block.data : block.action;
                sign.append(action);
                var sel = document.createElement('span');
                if(block.target){
                    sel.innerText = block.target;
                } else if(block.subAction){
                    sel.innerText = block.subAction;
                } else {
                    sel.innerText = "";
                }
                sign.append(sel);
                var not = document.createElement('span');
                not.innerText = block.inverted ? block.inverted : "";
                sign.append(not);
                blockElement.append(sign);
            }
            if(!(block.block === "if_entity" || block.block === "if_game" || block.block === "if_player" || block.block === "if_var" || block.block === "repeat" || block.block === "else")){
                var stone = document.createElement('stone');
                stone.classList.add('stone');
                blockDiv.append(stone)
            }
        }
        else if(block.id === "bracket"){
            topper.classList.add('air');
            blockElement.classList.add('piston','mat',block.direct,block.type)
        }
        blockDiv.prepend(stack);
        stack.append(topper);
        stack.append(blockElement);
        codeSpace.append(blockDiv);
    })
}

/**
 * 
 * @param element The element to search
 * @returns The block which the element is in
 */
function backup(element : HTMLElement) : HTMLDivElement {
    if(element.classList.contains('block')){
        return element as HTMLDivElement;
    }else{
        return backup(element.parentNode as HTMLElement)
    }
}