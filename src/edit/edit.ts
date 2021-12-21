import { startup, decode } from "../main/main"
let code = {"blocks":[]};

window.onload = () => {
    startup()
    if(sessionStorage.getItem('import')){
        code = JSON.parse(decode(sessionStorage.getItem('import') as string))
    }
    rendBlocks();
}

function rendBlocks(){
    var codeSpace = document.getElementById('codeBlocks') as HTMLDivElement;
    var messages = ["Boo.", "Boo, again!", "Hello.", "Hello!", "Call me bob the comment?", "Nice to meet you.", "GeorgeRNG :D", "What did the farmer say when he lost his tractor? Where's my tractor?", "Beyond that.", "Maybe it's gold.", "Au-."];
    codeSpace.innerHTML = `<!-- ${messages[Math.floor(Math.random() * messages.length)]} -->`; // hi
    code.blocks.forEach((value : {id: string, block: "block" | "bracket", direct: "open" | "close", type: "norm" | "repeat"}) => {
        console.log(value)
        var block = document.createElement('div');
        block.classList.add('block');
        var stack = document.createElement('div');
        var topper = document.createElement('div');
        var blockElement = document.createElement('div');
        if(value.id === "block"){
            topper.classList.add(['player_action','if_player','process','start_process','func','entity_action','if_entity'].includes(value.block) ? 'chest' : 'air');
            blockElement.classList.add(value.block, 'mat');
            var sign = document.createElement('div');
            sign.classList.add('sign');
            blockElement.append(sign);
            if(!['if_player'].includes(value.block)){
                var stone = document.createElement('stone');
                stone.classList.add('stone');
                block.append(stone)
            }
        }
        else if(value.id === "bracket"){
            topper.classList.add('air');
            blockElement.classList.add('piston','mat',value.direct,value.type)
        }
        block.prepend(stack);
        stack.append(topper);
        stack.append(blockElement);
        codeSpace.append(block);
    })
}