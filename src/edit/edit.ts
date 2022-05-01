import { startup, decodeTemplate, menu, minecraftColorHTML, dfNumber, snackbar, codeutilities, cuopen, encodeTemplate, user, MinecraftTextCompToCodes } from "../main/main";
import { ActionDump, CodeBlockIdentifier, CodeBlockTypeName } from "./actiondump";
import { Template, Block, SelectionBlock, SubActionBlock, BlockTag, DataBlock, SelectionBlocks, SelectionValues, Target, Bracket, BracketType, VarScope, PlacedBlock, Argument, ParsedItem, Item, Variable, Text, Number as DFNumber, Location as DFLocation, Vector, Sound, GameValue, g_valSelection, Particle, Potion} from "./template";
import { parse } from "nbt-ts";
import itemNames from './itemnames.json';
import { unflatten } from 'flat';

type tree = {
	[key: string]: tree | string;
}
let Sounds : tree
let ActDB : ActionDump
fetch(`${sessionStorage.getItem('apiEndpoint')}db`) // Gets ?actiondump.
			.then(response => response.json()) // some code probably from mdn docs.
			.then(data => { // unready required init
				ActDB = data;
				// console.log(ActDB.codeblocks.map(x => `${x.identifier} = "${x.name}"`).join(', '))
				rendBlocks();
				var blockPicker = document.getElementById('blocks');
				ActDB.codeblocks.forEach(block => { // placing blocks menu
					var blockDiv = document.createElement('div');
					blockDiv.draggable = true;
					blockDiv.style.backgroundImage = `url(https://dfonline.dev/public/images/${block.item.material.toUpperCase()}.png)`;
					blockDiv.ondragstart = () => {
						userMeta.type = 'newBlock';
						var value : any = {id: 'block', block: block.identifier /* lmao */}
						console.log(block.identifier);
						if(block.identifier !== 'else'){
							value.args = {'items':[]}
							if(block.identifier.includes('process') || block.identifier.includes('func')) value.data = '';
							else if(block.identifier === 'control') value.action = 'Wait';
							else value.action = '';
						}
						userMeta.value = value;
					}
					blockPicker.appendChild(blockDiv);
				})
				Sounds = unflatten(Object.fromEntries(ActDB.sounds.map(sound => [sound.sound,sound.sound])),{delimiter: '_'});
			})
			.catch(e => {
				// if it is 500, it means the backend server is down.
				if(e.status === 500){
					snackbar('Backend server is down. Please try again later.')
				}
				else{
					snackbar('An unexpected backend error occured. Please try again later.')
				}
				console.error(e);
			})
let userMeta:
{"type": 'block' | 'item' | 'newBlock' | undefined, "value": any | undefined, "canDragMove": boolean, "context" : boolean, "ctxKeys": {[ key: string]: HTMLButtonElement}, "search": {"index": number, "value": undefined | any[]}} =
{"type": undefined,                                 "value": undefined,       "canDragMove": true,    "context": false,    "ctxKeys": {},                                  "search": {"index": 0,      "value": undefined}};

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

// document.onkeyup = e => {
// 	if (e.key === "Alt") {
// 		e.preventDefault();
// 	}
// }

let contextMenu : HTMLDivElement;
let mouseInfo : HTMLDivElement;

window.onload = async function() { // when everything loads - this function is pretty hard to find lol.
	var start = startup();
	mouseInfo = start.mouseInfo;
	contextMenu = document.querySelector('div#context');
	if(start.urlParams.has('template')){
		sessionStorage.setItem('import',start.urlParams.get('template').replace(/ /g,'+'));
	}
	if(sessionStorage.getItem('import')){
		var importTemplate = sessionStorage.getItem('import');
		if(importTemplate.match(/H4sIA*[0-9A-Za-z+/]*={0,2}/)){
			console.log(sessionStorage.getItem('import'));
			code = JSON.parse(decodeTemplate(importTemplate));
		}
		else{
			code = JSON.parse(decodeTemplate((await fetch(`${window.sessionStorage.getItem('apiEndpoint')}save/${importTemplate}`).then(response => response.json())).data));
			snackbar('Grabbed template from server.');
		}
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

	await menuBar();
}

async function menuBar(){
	document.querySelector<HTMLButtonElement>('button#file').onclick = e => {
		e.stopPropagation();
		var {left, bottom} = (e.target as HTMLButtonElement).getBoundingClientRect();
		contextMenu.style.left = String(left) + "px";
		contextMenu.style.top = String(bottom) + "px";
		contextMenu.innerHTML = '';
		contextMenu.style.display = 'grid';
		var save = document.createElement('button');
		save.innerText = 'Save';
		save.disabled = true;
		contextMenu.append(save);
		var newTemplate = document.createElement('button');
		newTemplate.innerText = 'New Template';
		newTemplate.disabled = true;
		contextMenu.append(newTemplate);
		var exportTemplateButton = document.createElement('button'); // this variable contains a HTMLButtonElement, this variable is futher filled with the inner text (the text that shows in the button) to say 'Export'. This button is used to export the template, so when you click it you get various options for export the template, such as copying the internal data, the give command and sending it the the minecraft mod CodeUtilties throught the inbuilt Item API. The item API is an Application Programming Interface for minecraft, to send things like minecraft items and templates to minecraft, and DiamondFire (a server for making minigames in minecraft with blocks) templates to anything listening through the API.
		exportTemplateButton.innerText = 'Export';
		exportTemplateButton.onclick = async () => { // a mess, anyway the menu for export.
			let exportDiv = document.createElement('div');

			var p = document.createElement('p');
			p.innerText = `Get the template data${cuopen ? ', or send it to codeutilities,' : ', or connect to codeutilities to use the Item API,'} with the template you are currently working on.`;
			exportDiv.append(p);

			let options = document.createElement('div');
			options.style.display = 'grid';
			options.style.width = 'fit-content'

			var copyTemplate = document.createElement('button');
			copyTemplate.innerText = "Copy Data";
			copyTemplate.onclick = e => {
				var data = exportTemplate(JSON.stringify(code));
				var altName = data.name.replace('"','\\"').replace('\\','\\\\').replace("'","\\'");
				if(e.shiftKey || e.ctrlKey) navigator.clipboard.writeText(`/dfgive minecraft:ender_chest{display:{Name:'{"text":"${altName}"}'},PublicBukkitValues:{"hypercube:codetemplatedata":'{name:"${altName}",code:"${data.data}",version:1,author:"${data.author}"}'}} 1`);
				else navigator.clipboard.writeText(data.data);
			}
			options.append(copyTemplate);

			var CodeUtilsSend = document.createElement('button');
			CodeUtilsSend.innerText = 'Send to CodeUtilities';
			CodeUtilsSend.disabled = !cuopen;
			CodeUtilsSend.onclick = () => { // the code for sending :D
				codeutilities.send(JSON.stringify(
					{
						type: 'template',
						data: JSON.stringify(exportTemplate(JSON.stringify(code))),
						source: 'DFOnline'
					}
				));
				codeutilities.onmessage = e => {
					if(JSON.parse(e.data).status === 'success') snackbar('Recieved confirmation for sent template');
				}
			}
			options.append(CodeUtilsSend);



			var CopyLinkButton = document.createElement('button');
			CopyLinkButton.innerText = 'Copy Link';
			CopyLinkButton.onclick = async e => { // this code is for copying the link to the template, so you can share the template with others.
				var href : string
				if(e.shiftKey || e.ctrlKey) href = 'https://dfonline.dev/edit/';
				else href = location.origin + '/edit/';
				var searchParams = new URLSearchParams(location.search);
				var exportData = exportTemplate(JSON.stringify(code)).data;
				searchParams.set('template',exportData);
				navigator.clipboard.writeText(href + '?' + searchParams.toString());
			}
			options.append(CopyLinkButton);

			var CopyShortLinkButton = document.createElement('button');
			CopyShortLinkButton.innerText = 'Copy Short Link';
			CopyShortLinkButton.onclick = async e => {
				var href : string
				if(e.ctrlKey) href = 'https://dfonline.dev/edit/';
				else if(e.shiftKey) href = 'https://diamondfire.gitlab.io/template/';
				else href = location.origin + '/edit/';
				var searchParams = new URLSearchParams(location.search);
				var exportData : string = (await fetch(`${window.sessionStorage.getItem('apiEndpoint')}save`,{'body':exportTemplate(JSON.stringify(code)).data,'method':'POST'}).then(res => res.json())).id;
				searchParams.set(e.shiftKey ? 't' : 'template',e.shiftKey ? 'dfo:' + exportData : exportData);
				navigator.clipboard.writeText(href + '?' + searchParams.toString());
			}
			options.append(CopyShortLinkButton);

			exportDiv.append(options);
			menu('Export',exportDiv);
		}
		contextMenu.append(exportTemplateButton);
	}
	document.querySelector<HTMLButtonElement>('button#edit').onclick = e => {
		console.log(e.target);
		e.stopPropagation();
		var {left, bottom} = (e.target as HTMLButtonElement).getBoundingClientRect();
		contextMenu.style.left = String(left) + "px";
		contextMenu.style.top = String(bottom) + "px";
		contextMenu.innerHTML = '';
		contextMenu.style.display = 'grid';

		var renameVars = document.createElement('button');
		renameVars.innerText = 'Rename All Variables';
		renameVars.onclick = () => {
			var menuDiv = document.createElement('div');
			menuDiv.style.display = 'grid';

			var lookValue = document.createElement('input');
			lookValue.placeholder = 'Variable Name';
			menuDiv.append(lookValue);

			var replaceValue = document.createElement('input');
			replaceValue.placeholder = 'New Name'
			menuDiv.append(replaceValue);

			var scopeValue = document.createElement('select');
			var opt = document.createElement('option');
			opt.value = 'unsaved';
			opt.text = 'GAME';
			scopeValue.append(opt);
			opt = document.createElement('option');
			opt.value = 'save';
			opt.text = 'SAVE';
			scopeValue.append(opt);
			opt = document.createElement('option');
			opt.value = 'local';
			opt.text = 'LOCAL';
			scopeValue.append(opt);
			menuDiv.append(scopeValue);
			menuDiv.append(document.createElement('br'));


			{
				var replace = document.createElement('button');
				replace.innerText = 'Rename All'
				replace.onclick = () => {
					let results = 0;
					code.blocks = code.blocks.map(e => {
						var newBlock = e;
						if((e as SubActionBlock).args !== undefined){
							(e as SelectionBlock).args.items = (e as SelectionBlock).args.items.map(x => {
								var newItem = x;
								if(newItem.item.id === 'var' && newItem.item.data.scope === (scopeValue.value as VarScope) && newItem.item.data.name === lookValue.value){
									newItem.item.data.name = replaceValue.value;
									results++;
								}
								return newItem
							})
						}
						return newBlock;
					})
					snackbar(`Found ${results} variables.`)
				}
				menuDiv.append(replace);
			}
			menu('Rename All Variables',menuDiv);

		}
		contextMenu.append(renameVars);
	}
}

function rendBlocks(){ // look at this mess // on second thoughts don't, is even painfull for me to look at. // on third thoughts you can collapse most of the painfull stuff I never wish to look at again.
	console.groupCollapsed('REND BLOCKS');
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
		blockDiv.ondragover = e => {if(userMeta.type === 'block' || userMeta.type === 'newBlock'){e.preventDefault()}};
		blockDiv.addEventListener('drop',e => { // pain and when you drop on a codeblock

			var HTMLblock = backup(e.target as HTMLElement); // the HTML block you dropped on
			var id = (Number(HTMLblock.id.replace('block',''))); // numerical id of the block dropped on
			if(id !== userMeta.value){
				if(userMeta.type !== 'newBlock' && (Math.abs(id - userMeta.value) === 1 || e.shiftKey)){ // if it is next to the one you just used
					var swapData = JSON.parse((JSON.stringify(code.blocks[userMeta.value]))) as Readonly<Block>; // the block you held
					code.blocks[userMeta.value] = code.blocks[id]; // and some swapping shenanagins
					code.blocks[id] = swapData; // it works so I got it correct
				}
				else{
					var {x:posX,width} = HTMLblock.getBoundingClientRect(); // x on screen as posX and witdh
					var pushSpot = (id + Number(e.clientX > (width / 2) + posX))
					if(userMeta.type !== 'newBlock'){
						var data = JSON.parse((JSON.stringify(code.blocks[userMeta.value]))) as Readonly<Block>; // get the block you held
						code.blocks[userMeta.value]['id'] = 'killable'; // mark thing for deletion
						code.blocks.splice(pushSpot,0,data); // splice data in
					}
					else{
						code.blocks.splice(pushSpot,0,userMeta.value); // splice userMeta value in
						if(userMeta.value.block.includes('if') || userMeta.value.block === 'repeat'){
							var type : BracketType = userMeta.value.block === 'repeat' ? 'repeat' : 'norm';
							var open : Bracket = {id: 'bracket', direct: 'open', type};
							var close : Bracket = {id: 'bracket', direct: 'close', type};
							code.blocks.splice(pushSpot + 1,0,open,close)
						}

					}
					code.blocks = code.blocks.filter(y => y.id !== "killable"); // remove the ones marked for deletion. If nothing marked, nothing gone.
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
						if((block as DataBlock).data !== undefined){
							valueButton.innerHTML = 'D<u>a</u>ta';
						}
						if((block as SelectionBlock).action !== undefined || (block as SubActionBlock).subAction !== undefined){
							valueButton.innerHTML = '<u>A</u>ction'
						}
						valueButton.onclick = () => { // YEEE CONTEXT FOR EDITING ACTIONS
							setTimeout(() => {
								contextMenu.style.display = 'grid';
									var value = document.createElement('input');
									if((block as DataBlock).data === undefined){
									value.value = (block as SelectionBlock | SubActionBlock).action;
									var results = document.createElement('div');
									let pre = value.value.substring(value.selectionStart,0);
									value.onkeydown = e => { // ENTER ESCAPE AND TAB
										if(e.key === 'Enter'){
											setAction(i,value.value);
											contextMenu.click();
											rendBlocks();
										}
										else if(e.key === 'Escape'){
											contextMenu.click();
										}
										else if(e.key === 'Tab'){
											e.preventDefault();
											if(userMeta.search.value.length !== 0){
												value.value = userMeta.search.value[userMeta.search.index].name;
												value.setSelectionRange(pre.length,value.value.length);
												userMeta.search.index = (1 + userMeta.search.index) % userMeta.search.value.length;
											}
										}
										else if(e.key === 'Backspace') pre = value.value.substring(value.selectionStart + 1,0);
										else{
											userMeta.search.value = undefined;
											pre = value.value.substring(value.selectionStart,0);
										}
									}
									value.oninput = () => { // EVERYTHING ELSE THAT YOU TYPE
										results.innerHTML = '';
										if(value.value.length - pre.length >= 0){
											userMeta.search.value = ActDB.actions.filter(x => x.codeblockName === CodeBlockTypeName[block.block] && x.icon.description.length !== 0).filter(x => x.name.toLowerCase().startsWith(value.value.toLowerCase()));
											userMeta.search.index = 0;
											if(userMeta.search.value.length !== 0){
												var length = value.value.length;
												value.value = userMeta.search.value[userMeta.search.index].name;
												value.setSelectionRange(length,value.value.length);
												userMeta.search.index = (1 + userMeta.search.index) % userMeta.search.value.length;
												userMeta.search.value.forEach(v => {
													var res = document.createElement('button');
													res.innerText = v.name;
													res.onclick = () => {
														(block as SelectionBlock | SubActionBlock).action = v.name;
														rendBlocks()
													}
													results.append(res);
													results.append(document.createElement('br'));
												})
											}
											else userMeta.search.value = undefined;
										}
										pre = value.value.substring(value.selectionStart,0);
									}
									contextMenu.append(results);
									}
									else { // I forgor data blocks lmao
										value.value = (block as DataBlock).data
										value.onkeydown = e => {
											if(e.key === 'Enter'){
												(block as DataBlock).data = value.value;
												contextMenu.click();
												rendBlocks();
											}
											else if(e.key === 'Escape'){
												contextMenu.click();
											}
										}
									}
									value.onclick = e => {
										e.stopPropagation();
									}
									contextMenu.prepend(value);
									value.focus()
							})
						}
						userMeta.ctxKeys['a'] = valueButton;
						contextMenu.append(valueButton);
						if(SelectionBlocks.includes(block.block)){
							var targetButton = document.createElement('button');
							targetButton.innerHTML = '<u>S</u>election';
							targetButton.onclick = () => {
								setTimeout(() => {
									var target = document.createElement('select'); // selection
									target.value = (block as SelectionBlock).target;
									target.onclick = e => e.stopPropagation(); // allow clicking
									SelectionValues.forEach(sel => { // create the options
										var option = document.createElement('option');
										option.value = sel;
										option.innerText = sel;
										target.append(option);
									})
									target.oninput = () => {
										(block as SelectionBlock).target = (target.value as Target);
										contextMenu.click();
										rendBlocks();
									}
									contextMenu.append(target);
									contextMenu.style.display = 'grid'; // make ctx visible
									setTimeout(() => target.click())
								})
							}
							userMeta.ctxKeys['s'] = targetButton;
							contextMenu.append(targetButton);
						}
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

	var end = document.createElement('div')
	end.classList.add('block');
	end.ondragover = e => {if(userMeta.type === 'block' || userMeta.type === 'newBlock'){e.preventDefault()}};
	end.ondrop = () => {
		if(userMeta.type === 'block'){
			code.blocks.push(code.blocks[userMeta.value]);
			code.blocks.splice(userMeta.value,1);
			rendBlocks();
		}
		else if(userMeta.type === 'newBlock'){
			code.blocks.push(userMeta.value);
			rendBlocks();
		}
	}
	codeSpace.append(end);

	console.groupEnd();
}

/**
 * Set the action of a CodeBlock, this will fill in the block tags.
 *
 * Params:
 * @param index The index of the block to edit
 * @param value The action to set to (including data blocks)
 * @param ignoreInvalidAction Enable this to allow setting an action ignorant of if it exists
 *
 * Errors:
 * @throws `TypeError` If the block doesn't support actions or if `ignoreInvalidAction` is `true` and the block doesn't have that action
 * @throws `RangeError` If the block at `index` doesn't exist.
 */
function setAction(index: number, value: string, ignoreInvalidAction = false){
	var block = code.blocks[index]
	if(block){
		if(block.id === 'block'){
			if((block as DataBlock).data) (block as DataBlock).data = value;
			else if((block as SubActionBlock)){

				let action = ActDB.actions.find(act => (act.codeblockName === CodeBlockTypeName[(block as PlacedBlock).block] && act.name === value)) // this is the action in db

				if(value !== '' && !ignoreInvalidAction && action === undefined) throw new TypeError(`Action ${value} doesn't exist on block type ${CodeBlockTypeName[(block as PlacedBlock).block]}`);

				else{ // logic for block tags

					(block as SubActionBlock).action = value;
					var newItems = (block as SubActionBlock).args.items.filter(item => item.item.id !== 'bl_tag');
					if(action !== undefined){
						action.tags.forEach((tag,i) => {
							var newTag : Argument = ({
								slot: (26 - i),
								item: {
									id: 'bl_tag',
									data: {
										action: value,
										block: (block as PlacedBlock).block,
										option: tag.defaultOption,
										tag: tag.name,
									}
								}
							});
							newItems.push(newTag);
						});
					}
					(block as SubActionBlock).args.items = newItems;
				}
			}
			else throw new TypeError(`Block ${index} doesn't have a value.`)
		}
		else throw new TypeError(`Block ${index} is probably a ${block.id} which doesn't have a value.`)
	}
	else throw new RangeError(`Block ${index} doesn't exist.`)
}

/**
 * Opens a chest menu. If one is already open the previous one is overwritted to skip any animations.
 * @param id The id of the block to open the chest of.
 * @returns The menu element opened.
 */
function chestMenu(id : number){
	var block : SubActionBlock | SelectionBlock = code.blocks[id] as any;
	if(block.args !== undefined){
		var menuDiv = document.createElement('div');
		menuDiv.id = 'chest';
		[...Array(27).keys()].forEach((slotID) => { // each slot
			var slot = document.createElement('div');
			slot.classList.add('slot');
			const itemIndex = block.args.items.findIndex(i => i.slot == slotID)
			var item = (block.args.items[itemIndex]);
			var itemElement = document.createElement('div');
			itemElement.style.backgroundImage = "";
			if(item){ // if there in an item
				slot.id = String(itemIndex);
				slot.classList.add('notEmpty');
				if(item.item.id === 'bl_tag'){itemElement.draggable = false; itemElement.ondragstart = e => {e.preventDefault(); return false;}}
				else { // events basically
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
						userMeta.value = Number((e.target as HTMLDivElement).parentElement.id);
						contextMenu.innerHTML = '';
						contextMenu.style.left = String(e.clientX) + 'px';
						contextMenu.style.top = String(e.clientY) + 'px';
						contextMenu.style.display = 'grid';
						contextMenu.focus();
						var valueButton = document.createElement('button');
						valueButton.innerHTML = 'V<u>a</u>lue'
						valueButton.onclick = () => { // main value
							setTimeout(() => {
								contextMenu.style.display = 'grid';
								if(item.item.id === 'num' || item.item.id === 'txt' || item.item.id === 'var'){
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
								else if(item.item.id === 'loc'){
									var locationInput = document.createElement('div');
									locationInput.onclick = e => e.stopPropagation();
									locationInput.onkeydown = e => {
										console.log(e);
										if(e.key === 'Enter'){
											(item.item as unknown as DFLocation).data.loc.x = Number(xInput.value);
											(item.item as unknown as DFLocation).data.loc.y = Number(yInput.value);
											(item.item as unknown as DFLocation).data.loc.z = Number(zInput.value);
											(item.item as unknown as DFLocation).data.loc.pitch = Number(pitchInput.value);
											(item.item as unknown as DFLocation).data.loc.yaw = Number(yawInput.value);
											contextMenu.click();
										}
										if(e.key === 'Escape'){
											contextMenu.click();
										}
									}
									locationInput.style.display = 'grid';
									locationInput.style.gridTemplateRows = '1fr 1fr 1fr 1fr';

									var xLabel = document.createElement('label');
									xLabel.innerHTML = 'X: ';
									var xInput = document.createElement('input');
									xInput.type = 'number';
									xInput.value = String(item.item.data.loc.x);
									xLabel.append(xInput);
									locationInput.append(xLabel);

									var yLabel = document.createElement('label');
									yLabel.innerHTML = 'Y: ';
									var yInput = document.createElement('input');
									yInput.type = 'number';
									yInput.value = String(item.item.data.loc.y);
									yLabel.append(yInput);
									locationInput.append(yLabel);

									var zLabel = document.createElement('label');
									zLabel.innerHTML = 'Z: ';
									var zInput = document.createElement('input');
									zInput.type = 'number';
									zInput.value = String(item.item.data.loc.z);
									zLabel.append(zInput);
									locationInput.append(zLabel);

									var pitchLabel = document.createElement('label');
									pitchLabel.innerHTML = 'Pitch: ';
									var pitchInput = document.createElement('input');
									pitchInput.type = 'number';
									pitchInput.value = String(item.item.data.loc.pitch);
									pitchLabel.append(pitchInput);
									locationInput.append(pitchLabel);

									var yawLabel = document.createElement('label');
									yawLabel.innerHTML = 'Yaw: ';
									var yawInput = document.createElement('input');
									yawInput.type = 'number';
									yawInput.value = String(item.item.data.loc.yaw);
									yawLabel.append(yawInput);
									locationInput.append(yawLabel);

									contextMenu.append(locationInput);
									xLabel.focus();
								}
								else if(item.item.id === 'vec'){
									var vectorEdit = document.createElement('div');
									vectorEdit.onclick = e => e.stopPropagation();
									vectorEdit.onkeydown = e => {
										if(e.key === 'Enter'){
											(item.item as unknown as Vector).data.x = Number(xVecInput.value);
											(item.item as unknown as Vector).data.y = Number(yVecInput.value);
											(item.item as unknown as Vector).data.z = Number(zVecInput.value);
											contextMenu.click();
										}
										if(e.key === 'Escape'){
											contextMenu.click();
										}
									}
									vectorEdit.style.display = 'grid';
									vectorEdit.style.gridTemplateRows = '1fr 1fr 1fr';

									var xVecLabel = document.createElement('label');
									xVecLabel.innerHTML = 'X: ';
									var xVecInput = document.createElement('input');
									xVecInput.type = 'number';
									xVecInput.value = String(item.item.data.x);
									xVecLabel.append(xVecInput);
									vectorEdit.append(xVecLabel);

									var yVecLabel = document.createElement('label');
									yVecLabel.innerHTML = 'Y: ';
									var yVecInput = document.createElement('input');
									yVecInput.type = 'number';
									yVecInput.value = String(item.item.data.y);
									yVecLabel.append(yVecInput);
									vectorEdit.append(yVecLabel);

									var zVecLabel = document.createElement('label');
									zVecLabel.innerHTML = 'Z: ';
									var zVecInput = document.createElement('input');
									zVecInput.type = 'number';
									zVecInput.value = String(item.item.data.z);
									zVecLabel.append(zVecInput);
									vectorEdit.append(zVecLabel);

									contextMenu.append(vectorEdit);
									xVecLabel.focus();
								}
								else if(item.item.id === 'snd'){
									const soundEdit = document.createElement('div');
									soundEdit.onclick = e => e.stopPropagation();
									soundEdit.onkeydown = e => {
										if(e.key === 'Enter' || e.key === 'Escape'){
											contextMenu.click();
										}
									}
									soundEdit.style.display = 'grid';
									soundEdit.style.gridTemplateRows = '1fr 1fr 1fr';

									const soundValue = document.createElement('button');
									soundValue.innerHTML = 'Select Sound';
									soundValue.onclick = () => { // Select sound menu here because I am always looking for this piece of code.
										function soundTab(path : string[] = []){
											contextMenu.innerHTML = '';
											const soundSelect = document.createElement('div');
											soundSelect.style.display = 'grid';
											
											let sounds = Sounds;
											for(const element of path){
												sounds = sounds[element] as tree;
											}
											Object.entries(sounds).forEach(([key, value]) => {
												const button = document.createElement('button');
												button.innerHTML = key;
												button.onclick = e => {
													e.stopPropagation();
													if(typeof value === 'string'){
														// get the new name from the icon name, which df uses for some reason.
														const newSound = ActDB.sounds.find(s => s.sound === value).icon.name;
														(item.item as unknown as Sound).data.sound = newSound;
														soundValue.innerHTML = value;
														contextMenu.click();
													}
													else{
														soundTab([...path, key]);
													}
												}
												soundSelect.append(button);
											});
											contextMenu.append(soundSelect);
										}

										soundTab();
									}
									soundEdit.append(soundValue);

									const pitchLabel = document.createElement('label');
									pitchLabel.innerHTML = 'Pitch: ';
									const pitchInput = document.createElement('input');
									pitchInput.type = 'number';
									pitchInput.value = String(item.item.data.pitch);
									// set the input to be limited from 0 to 2
									pitchInput.oninput = () => {
										if(Number(pitchInput.value) < 0){
											pitchInput.value = '0';
										}
										else if(Number(pitchInput.value) > 2){
											pitchInput.value = '2';
										}

										(item.item as unknown as Sound).data.pitch = Number(pitchInput.value);
									}
									pitchLabel.append(pitchInput);
									soundEdit.append(pitchLabel);

									const volumeLabel = document.createElement('label');
									volumeLabel.innerHTML = 'Volume: ';
									const volumeInput = document.createElement('input');
									volumeInput.type = 'number';
									volumeInput.value = String(item.item.data.vol);
									// on input save the value to the item
									volumeInput.oninput = () => {
										(item.item as unknown as Sound).data.vol = Number(volumeInput.value);
									}
									volumeLabel.append(volumeInput);
									soundEdit.append(volumeLabel);

									contextMenu.append(soundEdit);
								}
								else if(item.item.id === 'g_val'){
									const gameValueEdit = document.createElement('div');
									gameValueEdit.style.display = 'grid';
									gameValueEdit.style.gridTemplateRows = '1fr 1fr';

									const selectValueButton = document.createElement('button');
									selectValueButton.innerHTML = 'Select Value';
									selectValueButton.onclick = e => {
										e.stopPropagation();
										contextMenu.innerHTML = '';

										const selectValue = document.createElement('div');
										selectValue.style.display = 'grid';
										ActDB.gameValueCategories.forEach(category => {
											if(category.icon.name.includes('Values')){
												const button = document.createElement('button');
												button.innerHTML = category.icon.name;
												button.onclick = e => {
													selectValue.innerHTML = '';
													e.stopPropagation();
													ActDB.gameValues.forEach(value => {
														if(value.category === category.identifier){
															const valueButton = document.createElement('button');
															valueButton.innerHTML = value.icon.name;
															valueButton.onclick = () => {
																(item.item as unknown as GameValue).data.type = value.icon.name;
																contextMenu.click();
															}
															selectValue.append(valueButton);
														}
													});
												}
												selectValue.append(button);

												contextMenu.append(selectValue);
											}
										});
									}
									gameValueEdit.append(selectValueButton);

									const targetLabel = document.createElement('label');
									targetLabel.innerHTML = 'Selection: ';
									targetLabel.onclick = e => e.stopPropagation();
									const targetInput = document.createElement('select');
									targetInput.onchange = e => {
										e.stopPropagation();
										(item.item as unknown as GameValue).data.target = (targetInput.value as g_valSelection);
									}
									SelectionValues.forEach(s => {
										// ignore the empty and "AllPlayers" selections
										if(s !== 'AllPlayers' && s !== ''){
											const option = document.createElement('option');
											option.value = s;
											option.innerHTML = s;
											// LastEntity has a custom display name of "Last-Spawned Entity"
											if(s === 'LastEntity'){
												option.innerHTML = 'Last-Spawned Entity';
											}
											if(s === (item.item as unknown as GameValue).data.target){
												option.selected = true;
											}
											targetInput.append(option);
										}
									});
									targetInput.value = (item.item as unknown as GameValue).data.target;
									targetLabel.append(targetInput);
									gameValueEdit.append(targetLabel);

									contextMenu.append(gameValueEdit);
								}
								else if(item.item.id === 'part'){
									const partEdit = document.createElement('div');
									partEdit.style.display = 'grid';

									const selectPartButton = document.createElement('button');
									selectPartButton.innerHTML = 'Select Particle';
									selectPartButton.onclick = e => {
										partEdit.innerHTML = '';
										e.stopPropagation();
										const categories = [
											"Ambient Particles",
											"Entity Behavior Particles",
											"Ambient Entity Particles",
											"Entity Attack Particles",
											"Liquid Particles",
											"Ambient Block Particles",
											"Block Behavior Particles"
										];
										categories.forEach(category => {
											const categoryButton = document.createElement('button');
											categoryButton.innerHTML = category;
											categoryButton.onclick = e => {
												e.stopPropagation();
												partEdit.innerHTML = '';
												// all the particles are in particleCategories for some reason.
												ActDB.particleCategories.forEach(particle => {
													if(particle.category === category){
														const particleButton = document.createElement('button');
														particleButton.innerHTML = particle.icon.name;
														particleButton.onclick = () => {
															(item.item as unknown as Particle).data.particle = particle.icon.name;
															contextMenu.click();
														}
														partEdit.append(particleButton);
													}
												});
											}
											partEdit.append(categoryButton);
										});
									}
									partEdit.append(selectPartButton);
									
									partEdit.append(document.createElement('hr'));

									const amountLabel = document.createElement('label');
									amountLabel.innerHTML = 'Amount: ';
									amountLabel.onclick = e => e.stopPropagation();
									const amountInput = document.createElement('input');
									amountInput.type = 'number';
									amountInput.value = String((item.item as unknown as Particle).data.cluster.amount);
									amountInput.onchange = () => {
										(item.item as unknown as Particle).data.cluster.amount = Number(amountInput.value);
									}
									amountLabel.append(amountInput);
									partEdit.append(amountLabel);

									const spreadLabel = document.createElement('label');
									spreadLabel.innerHTML = 'Spread: ';
									spreadLabel.onclick = e => e.stopPropagation();
									spreadLabel.style.display = 'flex';
									const spreadInputs = document.createElement('div');
									spreadInputs.style.display = 'flex';
									const spreadHorInput = document.createElement('input');
									spreadHorInput.type = 'number';
									spreadHorInput.value = String((item.item as unknown as Particle).data.cluster.horizontal);
									spreadHorInput.onchange = () => {
										(item.item as unknown as Particle).data.cluster.horizontal = Number(spreadHorInput.value);
									}
									spreadInputs.append(spreadHorInput);
									const spreadVerInput = document.createElement('input');
									spreadVerInput.type = 'number';
									spreadVerInput.value = String((item.item as unknown as Particle).data.cluster.vertical);
									spreadVerInput.onchange = () => {
										(item.item as unknown as Particle).data.cluster.vertical = Number(spreadVerInput.value);
									}
									spreadInputs.append(spreadVerInput);
									spreadLabel.append(spreadInputs);
									partEdit.append(spreadLabel);

									const dbParticle = ActDB.particleCategories.find(particle => particle.icon.name === (item.item as Particle).data.particle);

									if(dbParticle.fields.length > 0){
										partEdit.append(document.createElement('hr'));
										if(dbParticle.fields.includes('Color')){
											const colorLabel = document.createElement('label');
											colorLabel.innerHTML = 'Color: ';
											colorLabel.onclick = e => e.stopPropagation();
											const colorInput = document.createElement('input');
											colorInput.type = 'color';
											colorInput.value = item.item.data.data.rgb.toString(16);
											colorInput.onchange = () => {
												(item.item as Particle).data.data.rgb = parseInt(colorInput.value.replace('#', ''), 16);
											}
											colorLabel.append(colorInput);
											partEdit.append(colorLabel);
										}
										if(dbParticle.fields.includes('Color Variation')){
											const colorVariationLabel = document.createElement('label');
											colorVariationLabel.innerHTML = 'Color Variation: ';
											colorVariationLabel.onclick = e => e.stopPropagation();
											const colorVariationInput = document.createElement('input');
											colorVariationInput.type = 'number';
											colorVariationInput.value = String(item.item.data.data.colorVariation);
											colorVariationInput.onchange = () => {
												// it's a percentage so limit it as such
												let returnValue = true;
												if(Number(colorVariationInput.value) > 100){
													colorVariationInput.value = '100';
													returnValue = false;
												}
												if(Number(colorVariationInput.value) < 0){
													colorVariationInput.value = '0';
													returnValue = false;
												}
												(item.item as Particle).data.data.colorVariation = Number(colorVariationInput.value);
												return returnValue;
											}
											colorVariationLabel.append(colorVariationInput);
											partEdit.append(colorVariationLabel);
										}

										if(dbParticle.fields.includes('Motion')){
											const MotionLabel = document.createElement('label');
											MotionLabel.innerHTML = 'Motion: ';
											MotionLabel.onclick = e => e.stopPropagation();
											MotionLabel.style.display = 'flex';
											const MotionInputs = document.createElement('div');
											MotionInputs.style.display = 'flex';
											const MotionXInput = document.createElement('input');
											MotionXInput.type = 'number';
											MotionXInput.value = String(item.item.data.data.x);
											MotionXInput.onchange = () => {
												(item.item as Particle).data.data.x = Number(MotionXInput.value);
											}
											MotionInputs.append(MotionXInput);
											const MotionYInput = document.createElement('input');
											MotionYInput.type = 'number';
											MotionYInput.value = String(item.item.data.data.y);
											MotionYInput.onchange = () => {
												(item.item as Particle).data.data.y = Number(MotionYInput.value);
											}
											MotionInputs.append(MotionYInput);
											const MotionZInput = document.createElement('input');
											MotionZInput.type = 'number';
											MotionZInput.value = String(item.item.data.data.z);
											MotionZInput.onchange = () => {
												(item.item as Particle).data.data.z = Number(MotionZInput.value);
											}
											MotionInputs.append(MotionZInput);
											MotionLabel.append(MotionInputs);
											partEdit.append(MotionLabel);
										}
										if(dbParticle.fields.includes('Motion Variation')){
											const MotionVariationLabel = document.createElement('label');
											MotionVariationLabel.innerHTML = 'Motion Variation: ';
											MotionVariationLabel.onclick = e => e.stopPropagation();
											const MotionVariationInput = document.createElement('input');
											MotionVariationInput.type = 'number';
											MotionVariationInput.value = String(item.item.data.data.motionVariation);
											MotionVariationInput.onchange = e => {
												// it's a percentage, so limit it to such
												let returnValue = true;
												if(Number(MotionVariationInput.value) > 100){
													MotionVariationInput.value = '100';
													e.preventDefault();
													returnValue = false;
												}
												if(Number(MotionVariationInput.value) < 0){
													MotionVariationInput.value = '0';
													e.preventDefault();
													returnValue = false;
												}
												(item.item as Particle).data.data.motionVariation = Number(MotionVariationInput.value);
												return returnValue;
											}
											MotionVariationLabel.append(MotionVariationInput);
											partEdit.append(MotionVariationLabel);
										}

										if(dbParticle.fields.includes('Size')){
											const SizeLabel = document.createElement('label');
											SizeLabel.innerHTML = 'Size: ';
											SizeLabel.onclick = e => e.stopPropagation();
											const SizeInput = document.createElement('input');
											SizeInput.type = 'number';
											SizeInput.value = String(item.item.data.data.size);
											SizeInput.onchange = () => {
												(item.item as Particle).data.data.size = Number(SizeInput.value);
											}
											SizeLabel.append(SizeInput);
											partEdit.append(SizeLabel);
										}
										if(dbParticle.fields.includes('Size Variation')){
											const SizeVariationLabel = document.createElement('label');
											SizeVariationLabel.innerHTML = 'Size Variation: ';
											SizeVariationLabel.onclick = e => e.stopPropagation();
											const SizeVariationInput = document.createElement('input');
											SizeVariationInput.type = 'number';
											SizeVariationInput.value = String(item.item.data.data.sizeVariation);
											SizeVariationInput.onchange = () => {
												// it's a percentage, so limit it to such
												if(Number(SizeVariationInput.value) > 100){
													SizeVariationInput.value = '100';
												}
												if(Number(SizeVariationInput.value) < 0){
													SizeVariationInput.value = '0';
												}
												(item.item as Particle).data.data.sizeVariation = Number(SizeVariationInput.value);
											}
											SizeVariationLabel.append(SizeVariationInput);
											partEdit.append(SizeVariationLabel);
										}

										if(dbParticle.fields.includes('Material')){
											const MaterialLabel = document.createElement('label');
											MaterialLabel.innerHTML = 'Material: ';
											MaterialLabel.onclick = e => e.stopPropagation();
											const MaterialInput = document.createElement('input');
											MaterialInput.type = 'text';
											MaterialInput.value = String(item.item.data.data.material);
											MaterialInput.onchange = () => {
												(item.item as Particle).data.data.material = MaterialInput.value;
											}
											MaterialLabel.append(MaterialInput);
											partEdit.append(MaterialLabel);
										}
									}

									contextMenu.append(partEdit);
								}
							})
						}
						userMeta.ctxKeys['a'] = valueButton;
						contextMenu.append(valueButton);
						contextMenu.append(document.createElement('hr'));
						var deleteButton = document.createElement('button');
						deleteButton.innerHTML = '<u>D</u>elete';
						deleteButton.onclick = () => {
							block.args.items.splice(userMeta.value,1);
							chestMenu(id)
						}
						userMeta.ctxKeys['d'] = deleteButton;
						contextMenu.append(deleteButton);
					}
				}
				{ // the textures. epic
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
					else if (item.item.id === 'item'){
						var data = parse(item.item.data.item) as unknown as ParsedItem;
						itemElement.style.backgroundImage = `url(https://dfonline.dev/public/images/${data.id.toUpperCase().replace('MINECRAFT:','')}.png)`;
						if(data.Count.value > 1){
							var count = document.createElement('span');
							count.innerText = String(data.Count.value);
							itemElement.append(count);
						}
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
				itemElement.onmousemove = () => { // tooltips (that are regenerated whenever you move your mouse over an item)
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

						const dbParticle = ActDB.particleCategories.find(particle => particle.icon.name === (item.item as Particle).data.particle);
						// if the fields length has anything
						if(dbParticle.fields.length > 0){
							mouseInfo.append(document.createElement('hr'));
							
							if(dbParticle.fields.includes('Motion')){
								const motion = document.createElement('span');
								motion.innerText = `Motion: ${dfNumber(item.item.data.data.x)} ${dfNumber(item.item.data.data.y)} ${dfNumber(item.item.data.data.z)}`;
								motion.style.color = '#2affaa';
								mouseInfo.append(motion);
							}
							if(dbParticle.fields.includes('Motion Variation')){
								const motionVariation = document.createElement('span');
								motionVariation.innerText = 'Motion Variation: ' + String(item.item.data.data.motionVariation) + '%';
								mouseInfo.append(motionVariation);
							}

							if(dbParticle.fields.includes('Color')){
								const color = document.createElement('span');
								const colorHex = item.item.data.data.rgb.toString(16).toUpperCase(); // the color as #BLABLA
								color.innerText = 'Color: ' + colorHex;
								color.style.color = '#' + colorHex;
								mouseInfo.append(color);
							}
							if(dbParticle.fields.includes('Color Variation')){
								const colorVariation = document.createElement('span');
								colorVariation.innerText = 'Color Variation: ' + String(item.item.data.data.colorVariation) + '%';
								mouseInfo.append(colorVariation);
							}

							if(dbParticle.fields.includes('Material')){
								const material = document.createElement('span');
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
					else if(item.item.id === 'item'){
						var data = parse(item.item.data.item) as unknown as ParsedItem;
						console.log(data);

						if(!data.tag){
							data.tag = {};
						}


						var ItemName = document.createElement('span');
						if(data.tag.display && data.tag.display.Name){
							minecraftColorHTML(MinecraftTextCompToCodes(data.tag.display.Name)).forEach(e => ItemName.append(e));

							mouseInfo.append(ItemName);
						}
						else {
							ItemName.innerText = (itemNames as any)[data.id.toLowerCase().replace('minecraft:', '')];
							mouseInfo.append(ItemName);
						}

						if(data.tag.display && data.tag.display.Lore && data.tag.display.Lore.length > 0){
							data.tag.display.Lore.forEach((l : string) => {
								var lore = document.createElement('span');
								minecraftColorHTML(MinecraftTextCompToCodes(l)).forEach(e => lore.append(e));
								mouseInfo.append(lore);
							})
						}

						mouseInfo.append(document.createElement('hr'));


						var ItemType = document.createElement('span');
						ItemType.innerText = data.id;
						ItemType.style.color = 'gray';
						ItemType.style.textShadow = '1px 1px #000';
						mouseInfo.append(ItemType);

						var ItemCount = document.createElement('span');
						ItemCount.innerText = 'Count: ' + data.Count.value;
						ItemCount.style.color = 'gray';
						ItemCount.style.textShadow = '1px 1px #000';
						mouseInfo.append(ItemCount);
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
					else if(item.item.id === 'var'){
						// swap through the options
						if(!e.shiftKey){
							if(item.item.data.scope === 'local') item.item.data.scope = 'unsaved';
							else if(item.item.data.scope === 'unsaved') item.item.data.scope = 'saved';
							else if(item.item.data.scope === 'saved') item.item.data.scope = 'local';
						} else { // do it in the other order
							if(item.item.data.scope === 'unsaved') item.item.data.scope = 'local';
							else if(item.item.data.scope === 'saved') item.item.data.scope = 'unsaved';
							else if(item.item.data.scope === 'local') item.item.data.scope = 'saved';
						}
					}
					itemElement.onmousemove(e);
					chestMenu(id);
				}
			}
			else { // if there isn't an item.
				itemElement.id = 'empty' + String(slotID);
				itemElement.classList.add('empty');
				itemElement.ondragover = e => e.preventDefault();
				itemElement.ondrop = event => {
					var target = event.target as HTMLDivElement
					block.args.items[userMeta.value].slot = Number(target.id.replace('empty',''));
					chestMenu(id);
				}
				itemElement.onclick = (e) => {
					userMeta.value = slotID;

					e.preventDefault();
					e.stopPropagation();

					contextMenu.innerHTML = '';
					contextMenu.style.display = 'block';
					contextMenu.style.left = e.clientX + 'px';
					contextMenu.style.top = e.clientY + 'px';

					const workItem = (item : Item) => {
						block.args.items.push({
							slot: slotID,
							item: item
						});
						var menu = chestMenu(id);

						setTimeout(() => {
							menu.querySelectorAll<HTMLDivElement>('*.slot > .item')[slotID].oncontextmenu(e);
							setTimeout(() => {
								userMeta.ctxKeys['a'].click();
							}, 0);
						});
					}

					const varItem = document.createElement('button');
					varItem.classList.add('newValue');
					varItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/MAGMA_CREAM.png")';
					varItem.onclick = () => {
						var newItem : Variable = {
							id: 'var',
							data: {
								scope: 'unsaved',
								name: '',
							}
						}
						workItem(newItem);
					}
					contextMenu.append(varItem);

					const textItem = document.createElement('button');
					textItem.classList.add('newValue');
					textItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/BOOK.png")';
					textItem.onclick = () => {
						var newItem : Text = {
							id: 'txt',
							data: {
								name: '',
							}
						}
						workItem(newItem);
					}
					contextMenu.append(textItem);

					const numItem = document.createElement('button');
					numItem.classList.add('newValue');
					numItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/SLIME_BALL.png")';
					numItem.onclick = () => {
						var newItem : DFNumber = {
							id: 'num',
							data: {
								name: '',
							}
						}
						workItem(newItem);
					}
					contextMenu.append(numItem);

					const locItem = document.createElement('button');
					locItem.classList.add('newValue');
					locItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/PAPER.png")';
					locItem.onclick = () => {
						var newItem : DFLocation = {
							id: 'loc',
							data: {
								isBlock: false,
								loc: {
									x: 0,
									y: 0,
									z: 0,
									pitch: 0,
									yaw: 0
								},
							}
						}
						workItem(newItem);
					}
					contextMenu.append(locItem);

					const vecItem = document.createElement('button');
					vecItem.classList.add('newValue');
					vecItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/PRISMARINE_SHARD.png")';
					vecItem.onclick = () => {
						var newItem : Vector = {
							id: 'vec',
							data: {
								x: 0,
								y: 0,
								z: 0,
							}
						}
						workItem(newItem);
					}
					contextMenu.append(vecItem);

					const soundItem = document.createElement('button');
					soundItem.classList.add('newValue');
					soundItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/NAUTILUS_SHELL.png")';
					soundItem.onclick = () => {
						var newItem : Sound = {
							id: 'snd',
							data: {
								sound: '',
								vol: 2,
								pitch: 1,
							}
						}
						workItem(newItem);
					}
					contextMenu.append(soundItem);

					const gameValueItem = document.createElement('button');
					gameValueItem.classList.add('newValue');
					gameValueItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/NAME_TAG.png")';
					gameValueItem.onclick = () => {
						var newItem : GameValue = {
							id: 'g_val',
							data: {
								target: 'Default',
								type: '',
							}
						}
						workItem(newItem);
					}
					contextMenu.append(gameValueItem);

					const potionItem = document.createElement('button');
					potionItem.classList.add('newValue');
					potionItem.style.backgroundImage = 'url("https://dfonline.dev/public/images/DRAGON_BREATH.png")';
					potionItem.onclick = () => {
						var newItem : Potion = {
							id: 'pot',
							data: {
								amp: 0,
								dur: 1000000,
								pot: 'Speed',
							}
						}
						workItem(newItem);
					}
					contextMenu.append(potionItem);
				}
				itemElement.oncontextmenu = itemElement.onclick;
			}
			itemElement.classList.add('item')
			slot.appendChild(itemElement);
			menuDiv.append(slot);
		})
		var chestDiv = document.querySelector('#chest');
		if(chestDiv) {chestDiv.parentElement.replaceChild(menuDiv,chestDiv); return menuDiv;}
		else return menu('Chest',menuDiv);
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

/**
 *
 * @param code Stringified version of a template to compile
 * @returns data: contains the gzip template data, author: Who created the template, name: the name of the template
 */
function exportTemplate(code : string) : {data: string, author: string, name: string;}{
	let name : string;
	if(user && user.name) name = user.name;
	else name = 'DFOnline';
	return ({
		data: encodeTemplate(code), // lmao what I probably rename some variables and never saw this happen
		author: name,
		name: 'DFOnline Template', // proper name system planned later
	})
}