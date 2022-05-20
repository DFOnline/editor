import { startup, decodeTemplate, menu, snackbar, codeutilities, cuopen, encodeTemplate, user } from "../main/main";
import { ActionDump, CodeBlockIdentifier, CodeBlockTypeName } from "./ts/actiondump";
import type { Template, SelectionBlock, SubActionBlock, DataBlock, VarScope, PlacedBlock, Argument} from "./template";
import { unflatten } from 'flat';
import { rendBlocks } from "./ts/codeSpace";

export type tree = {
	[key: string]: tree | string;
}
export let Sounds : tree
export let ActDB : ActionDump
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
					blockDiv.ondragstart = e => {
						e.stopPropagation();
						userMeta.type = 'newBlock';
						const newBlock : any = {id: 'block', block: block.identifier /* lmao */}
						if(block.identifier !== 'else'){
							newBlock.args = {'items':[]}
							if(block.identifier.includes('process') || block.identifier.includes('func')) newBlock.data = '';
							else if(block.identifier === 'control') newBlock.action = 'Wait';
							else newBlock.action = '';
						}
						userMeta.value = newBlock;
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
export let userMeta:
{"type": 'block' | 'item' | 'newBlock' | undefined, "value": any | undefined, "canDragMove": boolean, "context" : boolean, "ctxKeys": {[ key: string]: HTMLButtonElement}, "search": {"index": number, "value": undefined | any[]}} =
{"type": undefined,                                 "value": undefined,       "canDragMove": true,    "context": false,    "ctxKeys": {},                                  "search": {"index": 0,      "value": undefined}};

export let code: Template;
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

export let contextMenu : HTMLDivElement;
export let mouseInfo : HTMLDivElement;

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
 *
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
	return ActDB.actions.find(x => CodeBlockTypeName[block] === x.codeblockName && x.name === action).tags;
}

export function findBlockTag(block: CodeBlockIdentifier, action: String, tag: String){
	return findBlockTags(block,action).find(x => tag === x.name)
}

export function findBlockTagOption(block: CodeBlockIdentifier, action: String, tag: String, option: string){
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