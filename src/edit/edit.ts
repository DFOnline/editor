import ContextMenu from '../main/context';
import { unflatten } from 'flat';
import { encodeTemplate, snackbar, startup, user } from "../main/main";
import Menu from "../main/menu";
import { Argument, DataBlock, loadTemplate, PlacedBlock, SubActionBlock, Template } from "./template";
import { ActionDump, CodeBlockIdentifier, CodeBlockTypeName } from "./ts/actiondump";
import { rendBlocks } from "./ts/codeSpace";
import menuBar from './ts/menubar/menubar';
import 'drag-drop-touch';

export type tree = {
	[key: string]: tree | string;
}
export let Sounds : tree
export let ActDB : ActionDump

export let userMeta:
{"type": 'block' | 'item' | 'newBlock' | undefined, "value": any | undefined, "canDragMove": boolean, "context" : boolean, "ctxKeys": {[ key: string]: HTMLButtonElement}, "search": {"index": number, "value": undefined | any[]}, "canEdit": boolean } =
{"type": undefined,                                 "value": undefined,       "canDragMove": true,    "context": false,    "ctxKeys": {},                                  "search": {"index": 0,      "value": undefined},         "canEdit": true    };

fetch(`${sessionStorage.getItem('apiEndpoint')}db`) // Gets ?actiondump.
			.then(response => response.json()) // some code probably from mdn docs.
			.then(data => { // unready required init
				ActDB = data;
				// console.log(ActDB.codeblocks.map(x => `${x.identifier} = "${x.name}"`).join(', '))
				if(userMeta.canEdit){
					try{ rendBlocks(); }
					catch (e) {
						snackbar('An error occurred whilst displaying the blocks. For more info check console.');
						console.error(e);
					}
					var blockPicker = document.getElementById('blocks');
					ActDB.codeblocks.forEach(block => { // placing blocks menu
						var blockDiv = document.createElement('div');
						blockDiv.draggable = true;
						blockDiv.style.backgroundImage = `url(https://dfonline.dev/public/images/${block.item.material.toUpperCase()}.png)`;
						blockDiv.ondragstart = e => {
							e.stopPropagation();
							userMeta.type = 'newBlock';
							const newBlock : any =  {id: 'block', block: block.identifier /* lmao */}
							if(block.identifier !== 'else'){
								newBlock.args = {'items':[]}
								if(block.identifier === 'func' || block.identifier === 'call_func' || block.identifier === 'process' || block.identifier === 'start_process'){
									newBlock.data = '';
									const func = [{"item": {"id": "bl_tag","data": {"option": "False","tag": "Is Hidden","action": "dynamic","block": "func"}},"slot": 26}];
									const call_func : undefined[] = [];
									const process = [{"item": {"id": "bl_tag","data": {"option": "False","tag": "Is Hidden","action": "dynamic","block": "process"}},"slot": 26}];
									const start_process = [{"item": {"id": "bl_tag","data": {"option": "Don't copy","tag": "Local Variables","action": "dynamic","block": "start_process"}},"slot": 25}, {"item": {"id": "bl_tag","data": {"option": "With current targets","tag": "Target Mode","action": "dynamic","block": "start_process"}},"slot": 26}];
									({call_func,func,process,start_process}[block.identifier]).forEach(x => newBlock.args.items.push(x))
								} 
								else if(block.identifier === 'control') newBlock.action = 'Wait';
								else if(block.identifier === 'set_var') newBlock.action = '=';
								else newBlock.action = '';
							}
							userMeta.value = newBlock;
						}
						blockPicker.appendChild(blockDiv);
					})
					}
					Sounds = unflatten(Object.fromEntries(ActDB.sounds.map(sound => [sound.sound,sound.sound])),{delimiter: '_'});
			})
			.catch(e => {
				// if it is 500, it means the backend server is down.
				if(e.status === 500){
					snackbar('Backend server is down. Please try again later.')
				}
				else{
					snackbar('An error occured. For more info check console.')
				}
				console.error(e);
			})

export let compareTemplate : Template;
export let code: Template = {'blocks':[]};
document.ondragstart = () => userMeta.canDragMove = false;
document.ondragend = () =>  userMeta.canDragMove = true;
document.ondrop = () =>  userMeta.canDragMove = true;
document.ontouchmove = (e) => {if(!userMeta.canDragMove){e.preventDefault();}}
document.onclick = () => contextMenu.click()
document.onscroll = () => contextMenu.click()
document.onkeydown = e => { if(userMeta.ctxKeys[e.key] !== undefined){ userMeta.ctxKeys[e.key].click() } }

// document.onkeyup = e => {
// 	if (e.key === "Alt") {
// 		e.preventDefault();
// 	}
// }

/**
 * @deprecated Use new `ContextMenu` instead.
 */
export let contextMenu : HTMLDivElement;
export let mouseInfo : HTMLDivElement;

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
export function setAction(index: number, value: string, ignoreInvalidAction = false){
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
 * This is used for getting the proper codeblock element from something inside it.
 * @param element The element to search
 * @returns The block which the element is in
 */
export function backup(element : HTMLElement) : HTMLDivElement {
	if(element.classList.contains('block')){
		return element as HTMLDivElement;
	}else{
		return backup(element.parentNode as HTMLElement)
	}
}

export function findBlockTags(block: CodeBlockIdentifier, action: String) {
	return ActDB.actions.find(x => CodeBlockTypeName[block] === x.codeblockName && (x.name === action || x.name === 'dynamic')).tags;
}

export function findBlockTag(block: CodeBlockIdentifier, action: String, tag: String){
	return findBlockTags(block,action).find(x => tag === x.name)
}

export function findBlockTagOption(block: CodeBlockIdentifier, action: String, tag: String, option: string){
	return findBlockTag(block,action,tag).options.find(x => x.name === option);
}

/**
 * This exports that code and various info about it in an object.
 * @param code Stringified version of a template to compile
 * @returns data: contains the gzip template data, author: Who created the template, name: the name of the template
 */
export function exportTemplate(code : string) : {data: string, author: string, name: string;}{
	let name : string;
	if(user && user.name) name = user.name;
	else name = 'DFOnline';
	return ({
		data: encodeTemplate(code), // lmao what I probably rename some variables and never saw this happen
		author: name,
		name: 'DFOnline Template', // proper name system planned later
	})
}

window.onload = async function onload() { // when everything loads - this function is pretty hard to find lol.
	try {
		Menu.setup();
		ContextMenu.setup();
	}
	catch (e) {
		snackbar('An error occured whilst setting up the editor. Check the console for more info.');
		console.error(e);
	}

	let start
	try {
		start = startup();
	}
	catch (e) {
		snackbar('An error occured whilst starting up the editor. Check the console for more info.');
		console.error(e);
		return;
	}

	mouseInfo = start.mouseInfo;
	contextMenu = document.querySelector('div#context');

	try {

		if(start.urlParams.has('template')){
			sessionStorage.setItem('import',start.urlParams.get('template').replace(/ /g,'+'));
		}
		if(sessionStorage.getItem('import')){
			var importTemplate = sessionStorage.getItem('import');
			code = await loadTemplate(importTemplate);
		}
		if(start.urlParams.get('compare')){
			compareTemplate = await loadTemplate(start.urlParams.get('compare').replace(/ /g,'+'));
			userMeta.canEdit = false;
		}

	}
	catch (e) {
		snackbar('An error occured whilst loading the template. Check the console for more info.');
		console.error(e);
		return;
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