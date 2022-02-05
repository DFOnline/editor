import { startup, decode, menu } from "../main/main";
import { ActionDump, CodeBlockTypeName } from "./actiondump";
import type { Template, Block } from "./template";

let ActDB : ActionDump
fetch('https://webbot.georgerng.repl.co/db') // Gets ?actiondump.
			.then(response => response.json()) // some code probably from mdn docs.
			.then(data => { // unready required init
				ActDB = data;
				// console.log(ActDB.codeblocks.map(x => `${x.identifier} = "${x.name}"`).join(', '))
				rendBlocks();
			})
let dragging: {"type": 'block' | undefined, "value": any | undefined} = {"type": undefined,"value": undefined}
let code: Template

let mouseInfo : HTMLDivElement;

window.onload = () => {
	mouseInfo = startup().mouseInfo
	if(sessionStorage.getItem('import')){
		code = JSON.parse(decode(sessionStorage.getItem('import')))
	}
	rendBlocks()
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
			var data = JSON.parse((JSON.stringify(code.blocks[dragging.value]))) as Readonly<Block>; // get the block
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
			var chest = ['player_action','if_player','process','start_process','func','entity_action','if_entity','repeat','set_var','if_var','control','select_obj'].includes(block.block);
			topper.classList.add(chest ? 'chest' : 'air');
			if(chest){
				topper.onclick = () => {chestMenu(i)}
			}
			blockElement.classList.add(block.block, 'mat');
			if(block.block !== "else"){
				var sign = document.createElement('div');
				sign.classList.add('sign');
				var name = document.createElement('span');
				name.innerText = CodeBlockTypeName[block.block];
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

function chestMenu(id : number){
	var menuDiv = document.createElement('div');
	menuDiv.id = 'chest';
	for (var x = 0; x < 27; x++) {
		var slot = document.createElement('div');
		slot.classList.add('slot');
		var item = (code.blocks[id].args.items.find(i => i.slot == x));
		var itemElement = document.createElement('img');
		itemElement.src = "";
		if(item){
			slot.id = String(item.slot);
			{ // the textures.
				if(item.item.id === 'txt'){
					itemElement.src = 'https://dfonline.dev/public/images/BOOK.png';
				}
				else if(item.item.id === 'num'){
					itemElement.src = 'https://dfonline.dev/public/images/SLIME_BALL.png';
				}
				else if(item.item.id === 'loc'){
					itemElement.src = 'https://dfonline.dev/public/images/PAPER.png';
				}
				else if (item.item.id === 'g_val'){
					itemElement.src = 'https://dfonline.dev/public/images/NAME_TAG.png';
				}
				else if (item.item.id === 'part'){
					itemElement.src = 'https://dfonline.dev/public/images/WHITE_DYE.png';
				}
				else if (item.item.id === 'pot'){
					itemElement.src = 'https://dfonline.dev/public/images/DRAGON_BREATH.png';
				}
				else if (item.item.id === 'snd'){
					itemElement.src = 'https://dfonline.dev/public/images/NAUTILUS_SHELL.png';
				}
				else if (item.item.id === 'var'){
					itemElement.src = 'https://dfonline.dev/public/images/MAGMA_CREAM.png';
				}
				else if (item.item.id === 'vec'){
					itemElement.src = 'https://dfonline.dev/public/images/PRISMARINE_SHARD.png';
				}
				else {
					itemElement.src = 'https://dfonline.dev/public/images/BARRIER.png';
					itemElement.classList.add('fadepulse')
				}
			}
			itemElement.onmousemove = (e) => {
				debugger;
				var item = code.blocks[id].args.items[Number((e.target as HTMLDivElement).id)]
				mouseInfo.style.display = 'block';
				mouseInfo.innerHTML = '';
				if(item.item.id === 'num' || item.item.id === 'txt'){
					var txt = document.createElement('span');
					txt.innerText = item.item.data.name;
					mouseInfo.appendChild(txt);
				}
			}
			itemElement.onmouseleave = () => {mouseInfo.style.display = 'none';}
		}
		itemElement.classList.add('item')
		slot.appendChild(itemElement);
		menuDiv.append(slot);
	}
	menu('Chest',menuDiv);
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