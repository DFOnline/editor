import { startup, decode, menu, minecraftColorHTML, dfNumber, snackbar } from "../main/main";
import { ActionDump, CodeBlockIdentifier, CodeBlockTypeName } from "./actiondump";
import type { Template, Block, SelectionBlock, SubActionBlock, BlockTag, DataBlock } from "./template";

let ActDB : ActionDump
fetch('https://webbot.georgerng.repl.co/db') // Gets ?actiondump.
			.then(response => response.json()) // some code probably from mdn docs.
			.then(data => { // unready required init
				ActDB = data;
				// console.log(ActDB.codeblocks.map(x => `${x.identifier} = "${x.name}"`).join(', '))
				rendBlocks();
			})
			.catch(() => {
				snackbar('An error occurred whilst getting required data.')
			})
let userMeta:
{"type": 'block' | 'item' | undefined, "value": any | undefined, "canDragMove": boolean, "context" : boolean, "ctxKeys": {[ key: string]: HTMLButtonElement}, "search": {"index": number, "value": undefined | any[]}} =
{"type": undefined,                    "value": undefined,       "canDragMove": true,    "context": false,    "ctxKeys": {},                                  "search": {"index": 0,      "value": undefined}};
let code: Template
document.ondragstart = () => {
	userMeta.canDragMove = false;
}
document.ondragend = () => {
	userMeta.canDragMove = true;
}
document.ondrop = () => {
	userMeta.canDragMove = true;
}
document.addEventListener('touchmove', function(e) { if(!userMeta.canDragMove){e.preventDefault();} }, { passive:false });

document.onclick = () => {
	contextMenu.click()
}
document.onscroll = () => {
	contextMenu.click()
}
document.onkeydown = e => {
	if(userMeta.ctxKeys[e.key] !== undefined){
		userMeta.ctxKeys[e.key].click()
	}
}

let contextMenu : HTMLDivElement;
let mouseInfo : HTMLDivElement;

window.onload = () => {
	var start = startup();
	mouseInfo = start.mouseInfo;
	contextMenu = document.querySelector('div#context');
	if(start.urlParams.has('template')){
		sessionStorage.setItem('import',start.urlParams.get('template').replace(/ /g,'+'));
	}
	if(sessionStorage.getItem('import')){
		code = JSON.parse(decode(sessionStorage.getItem('import')));
	}
	rendBlocks();

	contextMenu.onclick = () => {
		contextMenu.style.display = 'none';
		contextMenu.innerHTML = '';
		userMeta.ctxKeys = {};
		userMeta.search.index = 0;
		userMeta.search.value = undefined;
	}
	contextMenu.oncontextmenu = e => {(e.target as HTMLElement).click(); e.preventDefault();};
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
		blockDiv.ondrag = () => {userMeta.type = 'block',userMeta.value = i}
		blockDiv.ondragover = e => {if(userMeta.type === 'block'){e.preventDefault()}};
		blockDiv.addEventListener('drop',e => { // pain

			var HTMLblock = backup(e.target as HTMLElement); // the HTML block you dropped on
			var id = (Number(HTMLblock.id.replace('block',''))); // numerical id of the block dropped on
			if(id !== userMeta.value){
				if(Math.abs(id - userMeta.value) === 1 || e.shiftKey){ // if it is next to the one you just used
					var swapData = JSON.parse((JSON.stringify(code.blocks[userMeta.value]))) as Readonly<Block>; // the block you held
					code.blocks[userMeta.value] = code.blocks[id]; // and some swapping shenanagins
					code.blocks[id] = swapData; // it works so I got it correct
				}
				else{
					var {x:posX,width} = HTMLblock.getBoundingClientRect(); // x on screen as posX and witdh
					var data = JSON.parse((JSON.stringify(code.blocks[userMeta.value]))) as Readonly<Block>; // get the block you held
					code.blocks[userMeta.value]['id'] = 'killable'; // mark thing for deletion
					code.blocks.splice((id + Number(e.clientX > (width / 2) + posX)),0,data); // splice it in
					code.blocks = code.blocks.filter(y => y.id !== "killable"); // remove the one marked for deletion
				}
				rendBlocks();
			}
		}); // why doesn't it exist add HTMLElement.drop??
		blockDiv.oncontextmenu = e => { // the right click menu :D
			if(block.id !== 'killable'){
				e.preventDefault();
				contextMenu.innerHTML = '';
				contextMenu.style.left = String(e.clientX) + 'px';
				contextMenu.style.top = String(e.clientY) + 'px';
				contextMenu.style.display = 'grid';
				contextMenu.focus()
				if(block.id !== 'bracket'){
					if(block.block !== 'else'){
						var valueButton = document.createElement('button');
						if((block as DataBlock).data){
							valueButton.innerHTML = 'D<u>a</u>ta';
						}
						if((block as SelectionBlock).action !== undefined || (block as SubActionBlock).subAction !== undefined){
							valueButton.innerHTML = '<u>A</u>ction'
						}
						valueButton.onclick = () => {
							setTimeout(() => {
								contextMenu.style.display = 'grid';
									var value = document.createElement('input');
									value.value = (block as SelectionBlock | SubActionBlock).action;
									value.onkeydown = e => {
										if(e.key === 'Enter'){
											(block as SelectionBlock | SubActionBlock).action = value.value;
											contextMenu.click();
											rendBlocks();
										}
										else if(e.key === 'Escape'){
											contextMenu.click();
										}
										else if(e.key === 'Tab'){
											e.preventDefault();
											if(userMeta.search.value === undefined){
												userMeta.search.value = ActDB.actions.filter(x => x.codeblockName === CodeBlockTypeName[block.block]).filter(x => x.name.toLowerCase().includes(value.value.toLowerCase()));
												userMeta.search.index = 0;
											}
											value.value = userMeta.search.value[userMeta.search.index].name;
											userMeta.search.index = (1 + userMeta.search.index) % userMeta.search.value.length;
										}
										else{
											userMeta.search.value = undefined;
										}
									}
									value.onclick = e => {
										e.stopPropagation();
									}
									contextMenu.append(value);
									value.focus()
							})
						}
						userMeta.ctxKeys['a'] = valueButton;
						contextMenu.append(valueButton);
						if(block.block.includes('if_')){ // NOT button
							var not = document.createElement('button');
							not.innerHTML = '<u>N</u>OT';
							not.onclick = () => {
								(block as SelectionBlock).inverted = (block as SelectionBlock).inverted === 'NOT' ? '' : 'NOT';
								rendBlocks();
							}
							userMeta.ctxKeys['n'] = not;
							contextMenu.append(not);
						}
						contextMenu.append(document.createElement('hr'));
					}
				}
				var deleteButton = document.createElement('button');
				deleteButton.innerHTML = '<u>D</u>elete';
				deleteButton.onclick = () => {
					code.blocks.splice(i,1);
					rendBlocks()
				}
				userMeta.ctxKeys['d'] = deleteButton;
				contextMenu.append(deleteButton);
			}
		}
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

				var BlockType = document.createElement('span');
				BlockType.innerText = CodeBlockTypeName[block.block];
				sign.append(BlockType);

				var ActionLine = document.createElement('span');
				ActionLine.innerText = block.block === "call_func" || block.block === "func" || block.block === "process" || block.block === "start_process" ? block.data : (block as SelectionBlock).action;
				sign.append(ActionLine);

				var SelectionLine = document.createElement('span');
				if((block as SelectionBlock).target){
					SelectionLine.innerText = (block as SelectionBlock).target;
				} else if((block as SubActionBlock).subAction){
					SelectionLine.innerText = (block as SubActionBlock).subAction;
				} else {
					SelectionLine.innerText = "";
				}
				sign.append(SelectionLine);
				var not = document.createElement('span');
				not.innerText = (block as SelectionBlock).inverted ? (block as SelectionBlock).inverted : "";
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
	var block : SubActionBlock | SelectionBlock = code.blocks[id] as any;
	if(block.args !== undefined){
		var menuDiv = document.createElement('div');
		menuDiv.id = 'chest';
		[...Array(27).keys()].forEach((x) => {
			var slot = document.createElement('div');
			slot.classList.add('slot');
			const itemIndex = block.args.items.findIndex(i => i.slot == x)
			var item = (block.args.items[itemIndex]);
			var itemElement = document.createElement('div');
			itemElement.style.backgroundImage = "";
			if(item){
				slot.id = String(itemIndex);
				if(item.item.id === 'bl_tag'){itemElement.draggable = false; itemElement.ondragstart = e => {e.preventDefault(); return false;}}
				else {
					itemElement.draggable = true;
					itemElement.ondragstart = event => {
		 				userMeta.type = 'item';
						userMeta.value = Number((event.target as HTMLDivElement).parentElement.id);
					}
					itemElement.ondragover = e => e.preventDefault();
					itemElement.ondrop = event => {
						var dropOn = block.args.items[Number((event.target as HTMLDivElement).parentElement.id)]; // the item you just dropped onto
						var dropping = block.args.items[userMeta.value];
						const swap = dropOn.slot;
						dropOn.slot = dropping.slot;
						dropping.slot = swap;
						chestMenu(id);
					}
					itemElement.oncontextmenu = e => { // the right click menu :D
						e.preventDefault();
						contextMenu.innerHTML = '';
						contextMenu.style.left = String(e.clientX) + 'px';
						contextMenu.style.top = String(e.clientY) + 'px';
						contextMenu.style.display = 'grid';
						contextMenu.focus();
						var valueButton = document.createElement('button');
						valueButton.innerHTML = 'V<u>a</u>lue'
						valueButton.onclick = () => {
							setTimeout(() => {
								contextMenu.style.display = 'grid';
								if(item.item.id === 'num' || item.item.id === 'txt'){
									var value = document.createElement('input');
									value.value = item.item.data.name;
									value.onkeydown = e => {
										if(e.key === 'Enter'){
											if(!e.shiftKey){
												(item.item.data as {name: string}).name = value.value;
												contextMenu.click();
											}
											else{
												value.value += '\n';
											}
										}
										if(e.key === 'Escape'){
											contextMenu.click();
										}
									}
									value.onclick = e => {
										e.stopPropagation();
									}
									contextMenu.append(value);
									value.focus()
								}
							})
						}
						userMeta.ctxKeys['a'] = valueButton;
						contextMenu.append(valueButton);
						contextMenu.append(document.createElement('hr'));
						var deleteButton = document.createElement('button');
						deleteButton.innerHTML = '<u>D</u>elete';
						deleteButton.onclick = event => {

							block.args.items.splice(Number((event.target as HTMLDivElement).parentElement.id),1);
							chestMenu(id)
						}
						userMeta.ctxKeys['d'] = deleteButton;
						contextMenu.append(deleteButton);
					}
				}
				{ // the textures.
					if(item.item.id === 'txt'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/BOOK.png)';
					}
					else if(item.item.id === 'num'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/SLIME_BALL.png)';
					}
					else if(item.item.id === 'loc'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/PAPER.png)';
					}
					else if (item.item.id === 'g_val'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/NAME_TAG.png)';
					}
					else if (item.item.id === 'part'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/WHITE_DYE.png)';
					}
					else if (item.item.id === 'pot'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/DRAGON_BREATH.png)';
					}
					else if (item.item.id === 'snd'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/NAUTILUS_SHELL.png)';
					}
					else if (item.item.id === 'var'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/MAGMA_CREAM.png)';
					}
					else if (item.item.id === 'vec'){
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/PRISMARINE_SHARD.png)';
					}
					else if (item.item.id === 'bl_tag'){
						try{
							itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/' + (findBlockTagOption(block.block,block.action,item.item.data.tag,item.item.data.option).icon.material) + '.png)';
						}
						catch{
							itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/BARRIER.png)';
							itemElement.classList.add('fadepulse');
						}
					}
					else {
						itemElement.style.backgroundImage = 'url(https://dfonline.dev/public/images/BARRIER.png)';
						itemElement.classList.add('fadepulse');
					}
				}
				itemElement.onmousemove = (e) => {
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
						const tags = findBlockTag(block.block, block.action, item.item.data.tag);
						var tagName = document.createElement('span');
						tagName.innerText = 'Tag: ' + item.item.data.tag
						tagName.style.color = 'yellow';
						mouseInfo.append(tagName);
						mouseInfo.append(document.createElement('hr'));
						tags.options.forEach(t => {
							const tagElement = document.createElement('span');
							tagElement.innerText = t.name;
							if(t.name === tag.name){tagElement.style.color = 'aqua';}
							else{tagElement.style.color = 'white';}
							mouseInfo.append(tagElement);
						})
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
				itemElement.onclick = (e) => {
					if(item.item.id === 'bl_tag'){
						const tag = findBlockTag(block.block,block.action,item.item.data.tag);
						item.item.data.option = (tag.options[(tag.options.findIndex(x => x.name === (item.item as BlockTag).data.option) + 1) % tag.options.length].name); // yeh cool line
					}
					itemElement.onmousemove(e);
					chestMenu(id);
				}
			}
			else{
				itemElement.id = 'empty' + String(x);
				itemElement.ondragover = e => e.preventDefault();
				itemElement.ondrop = event => {
					var target = event.target as HTMLDivElement
					block.args.items[userMeta.value].slot = Number(target.id.replace('empty',''));
					chestMenu(id);
				}
			}
			itemElement.classList.add('item')
			slot.appendChild(itemElement);
			menuDiv.append(slot);
		})
		var chestDiv = document.querySelector('#chest');
		if(chestDiv) chestDiv.parentElement.replaceChild(menuDiv,chestDiv);
		else menu('Chest',menuDiv);
	}
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

function findBlockTag(block: CodeBlockIdentifier, action: String, tag: String){
	return findBlockTags(block,action).find(x => tag === x.name)
}

function findBlockTagOption(block: CodeBlockIdentifier, action: String, tag: String, option: string){
	return findBlockTag(block,action,tag).options.find(x => x.name === option);
}