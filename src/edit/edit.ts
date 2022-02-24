import { startup, decode, menu, minecraftColorHTML, dfNumber } from "../main/main";
import { ActionDump, CodeBlockIdentifier, CodeBlockTypeName } from "./actiondump";
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
	var start = startup();
	mouseInfo = start.mouseInfo;
	if(start.urlParams.has('template')){
		sessionStorage.setItem('import',start.urlParams.get('template').replace(/ /g,'+'));
	}
	if(sessionStorage.getItem('import')){
		code = JSON.parse(decode(sessionStorage.getItem('import')));
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
			var chest = ['player_action','if_player','process','start_process','func','entity_action','if_entity','repeat','set_var','if_var','control','select_obj','game_action','if_game'].includes(block.block);
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
		var block = code.blocks[id];
		var slot = document.createElement('div');
		slot.classList.add('slot');
		const itemIndex = block.args.items.findIndex(i => i.slot == x)
		var item = (block.args.items[itemIndex]);
		var itemElement = document.createElement('img');
		itemElement.src = "";
		if(item){
			slot.id = String(itemIndex);
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
				else if (item.item.id === 'bl_tag'){
					try{
						itemElement.src = 'https://dfonline.dev/public/images/' + (findBlockTagOption(block.block,block.action,item.item.data.tag,item.item.data.option).icon.material) + '.png';
					}
					catch{
						itemElement.src = 'https://dfonline.dev/public/images/BARRIER.png';
						itemElement.classList.add('fadepulse');
					}
				}
				else {
					itemElement.src = 'https://dfonline.dev/public/images/BARRIER.png';
					itemElement.classList.add('fadepulse');
				}
			}
			itemElement.onmousemove = (e) => {
				var item = block.args.items[Number((e.target as HTMLDivElement).parentElement.id)]
				mouseInfo.style.display = 'grid';
				mouseInfo.innerHTML = '';
				if (item.item.id === 'num' || item.item.id === 'txt') {
					var txt = document.createElement('div');
					minecraftColorHTML(item.item.data.name,item.item.id === 'num' ? '§c' : undefined).forEach(x => txt.appendChild(x));
					mouseInfo.append(txt);
				}
				else if (item.item.id === 'var'){
					var name = document.createElement('span');
					name.innerText = item.item.data.name;
					mouseInfo.append(name);
					var scope = document.createElement('span');
					if(item.item.data.scope === 'local'){
						scope.innerText = 'LOCAL';
						scope.style.color = '#55ff55'
					}
					else if(item.item.data.scope === 'saved'){
						scope.innerText = 'SAVE';
						scope.style.color = '#ffff55';
					}
					else {
						scope.innerText = 'GAME';
						scope.style.color = '#aaaaaa';
					}
					mouseInfo.append(scope);
				}
				else if (item.item.id === 'loc'){
					var title = document.createElement('span');
					title.innerText = 'Location';
					title.style.color = '#55ff55';
					mouseInfo.append(title);
					var x = document.createElement('span');
					x.innerText = 'X: ' + dfNumber(item.item.data.loc.x);
					mouseInfo.append(x);
					var y = document.createElement('span');
					y.innerText = 'Y: ' + dfNumber(item.item.data.loc.y);
					mouseInfo.append(y);
					var z = document.createElement('span');
					z.innerText = 'Z: ' + dfNumber(item.item.data.loc.z);
					mouseInfo.append(z);
					var pitch = document.createElement('span');
					pitch.innerText = 'p: ' + dfNumber(item.item.data.loc.pitch);
					mouseInfo.append(pitch);
					var yaw = document.createElement('span');
					yaw.innerText = 'y: ' + dfNumber(item.item.data.loc.yaw);
					mouseInfo.append(yaw);
				}
				else if (item.item.id === 'vec'){
					var titlev = document.createElement('span');
					titlev.innerText = 'Vector';
					titlev.style.color = '#2affaa';
					mouseInfo.append(titlev);
					var xv = document.createElement('span');
					xv.innerText = 'X: ' + dfNumber(item.item.data.x);
					mouseInfo.append(xv);
					var yv = document.createElement('span');
					yv.innerText = 'Y: ' + dfNumber(item.item.data.y);
					mouseInfo.append(yv);
					var zv = document.createElement('span');
					zv.innerText = 'Z: ' + dfNumber(item.item.data.z);
					mouseInfo.append(zv);
				}
				else if (item.item.id === 'pot'){
					var titlepot = document.createElement('span');
					titlepot.innerText = 'Potion Effect';
					titlepot.style.color = '#ff557f';
					mouseInfo.append(titlepot);
					var typepot = document.createElement('span');
					typepot.innerText = item.item.data.pot
					mouseInfo.append(typepot);
					mouseInfo.append(document.createElement('hr'));
					var amp = document.createElement('span');
					amp.innerText = 'Amplifier: ' + String(item.item.data.amp)
					mouseInfo.append(amp);
					var dur = document.createElement('span');
					dur.innerText = 'Duration: ' + String(item.item.data.dur) + ' ticks';
					mouseInfo.append(dur);
				}
				else if (item.item.id === 'snd'){
					var titles = document.createElement('span');
					titles.innerText = 'Sound';
					titles.style.color = '#5555ff';
					titles.style.textShadow = '1px 1px #000'; // the original sound color contrasts really badly.
					mouseInfo.append(titles);
					var sound = document.createElement('span');
					sound.innerText = item.item.data.sound;
					mouseInfo.append(sound);
					mouseInfo.append(document.createElement('hr'))
					var pitchs = document.createElement('span');
					pitchs.innerText = 'Pitch: ' + String(dfNumber(item.item.data.pitch));
					mouseInfo.append(pitchs)
					var volume = document.createElement('span');
					volume.innerText = 'Volume: ' + String(dfNumber(item.item.data.vol));
					mouseInfo.append(volume);
				}
				else if (item.item.id === 'g_val'){
					var gval = document.createElement('span');
					gval.innerText = item.item.data.type;
					mouseInfo.append(gval);
					var selection = document.createElement('span');
					selection.innerText = item.item.data.target;
					if(item.item.data.target === 'Selection' || item.item.data.target === 'Default'){
						selection.style.color = '#55FF55'
					}
					else if(item.item.data.target === 'Killer' || item.item.data.target === 'Damager'){
						selection.style.color = '#FF5555'
					}
					else if(item.item.data.target === 'LastEntity' || item.item.data.target === 'Shooter'){
						selection.style.color = '#FFFF55';
						if(item.item.data.target === 'LastEntity'){
							selection.innerText = 'Last-Spawned Entity';
						}
					}
					else if(item.item.data.target === 'Victim'){
						selection.style.color = '#5555FF';
						selection.style.textShadow = '1px 1px #000';
					}
					else if(item.item.data.target === 'Projectile'){
						selection.style.color = '#55FFFF';
					}
					mouseInfo.append(selection);
				}
				else if (item.item.id === 'part'){
					var titlep = document.createElement('span');
					titlep.innerText = 'Particle Effect';
					titlep.style.color = '#aa55ff';
					titlep.style.textShadow = '1px 1px #000';
					mouseInfo.append(titlep);
					var par = document.createElement('span');
					par.innerText = item.item.data.particle;
					mouseInfo.append(par);
					mouseInfo.append(document.createElement('hr'));
					var amount = document.createElement('span');
					amount.innerText = "Amount: " + String(item.item.data.cluster.amount);
					mouseInfo.append(amount);
					var spread = document.createElement('span');
					spread.innerText = 'Spread: ' + dfNumber(item.item.data.cluster.horizontal) + ' ' + dfNumber(item.item.data.cluster.vertical); // string templates go brrrrr // tbh this is mostly function so I think a string template would look worse but atleast I mention as such in a massive line to make mild refrence to the existance to string litterals, their often place in strings generated like this and their still uselessness here despite what they are usefull for.
					mouseInfo.append(spread);
					if(item.item.data.data.motionVariation !== undefined || item.item.data.data.colorVariation !== undefined || item.item.data.data.material !== undefined){
						mouseInfo.append(document.createElement('hr'));
						if(item.item.data.data.motionVariation !== undefined){
							var motion = document.createElement('span');
							motion.innerText = `Motion: ${dfNumber(item.item.data.data.x)} ${dfNumber(item.item.data.data.y)} ${dfNumber(item.item.data.data.z)}`;
							motion.style.color = '#2affaa';
							mouseInfo.append(motion);
							var motionVariation = document.createElement('span');
							motionVariation.innerText = 'Motion Variation: ' + String(item.item.data.data.motionVariation) + '%';
							mouseInfo.append(motionVariation);
						}
						if(item.item.data.data.colorVariation !== undefined){
							var color = document.createElement('span');
							const colorHex = item.item.data.data.rgb.toString(16).toUpperCase(); // the color as #BLABLA
							color.innerText = 'Color: ' + colorHex;
							color.style.color = '#' + colorHex;
							mouseInfo.append(color);
							var colorVariation = document.createElement('span');
							colorVariation.innerText = 'Color Variation: ' + String(item.item.data.data.colorVariation) + '%';
							mouseInfo.append(colorVariation);
						}
						if(item.item.data.data.material !== undefined){
							var material = document.createElement('span');
							material.innerText = 'Material: ' + item.item.data.data.material.toLowerCase();
							mouseInfo.append(material);
						}
					}
				}
				else if (item.item.id === 'bl_tag'){
					const tag = findBlockTagOption(block.block, block.action, item.item.data.tag, item.item.data.option);
					const tags = findBlockTags(block.block, block.action)
					var tagName = document.createElement('span');
					tagName.innerText = 'Tag: ' + item.item.data.tag
					tagName.style.color = 'yellow';
					mouseInfo.append(tagName);
					mouseInfo.append(document.createElement('hr'));
					tags.forEach(t => t.options.forEach(t => {
						const tagElement = document.createElement('span');
						tagElement.innerText = t.name;
						if(t.name === tag.name){tagElement.style.color = 'aqua';}
						else{tagElement.style.color = 'white';}
						mouseInfo.append(tagElement);
					}))
				}
				else {
					var info = document.createElement('span');
					info.innerText = "It seems this item type\nisn't implemented yet."
					info.style.color = 'red';
					mouseInfo.append(info);
				}
				console.log(item.item);
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

function findBlockTags(block: CodeBlockIdentifier, action: String) {
	return ActDB.actions.find(x => CodeBlockTypeName[block] === x.codeblockName && x.name === action).tags;
}

function findBlockTagOption(block: CodeBlockIdentifier, action: String, tag: String, option: string){
	return findBlockTags(block,action).find(x => tag === x.name).options.find(x => x.name === option);
}