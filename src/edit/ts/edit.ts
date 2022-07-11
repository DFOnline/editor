import { encodeTemplate, user } from "../../main/main";
import type { Argument, DataBlock, PlacedBlock, SubActionBlock, Template } from "../template";
import { ActionDump, CodeBlockIdentifier, CodeBlockTypeName } from "./actiondump";
import 'drag-drop-touch';
import { unflatten } from "flat";

export type tree = {
	[key: string]: tree | string;
}
export let Sounds : tree
export let ActDB : ActionDump
export let compareTemplate : Template;
export let code: Template = {'blocks':[]};
export let userMeta:
{"type": 'block' | 'item' | 'newBlock' | undefined, "value": any | undefined, "canDragMove": boolean, "context" : boolean, "ctxKeys": {[ key: string]: HTMLButtonElement}, "search": {"index": number, "value": undefined | any[]}, "canEdit": boolean } =
{"type": undefined,                                 "value": undefined,       "canDragMove": true,    "context": false,    "ctxKeys": {},                                  "search": {"index": 0,      "value": undefined},         "canEdit": true    };

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

window.addEventListener('load',() => {
	mouseInfo = document.querySelector('div.mouseinfo');
	contextMenu = document.querySelector('div#context');
})

export function onactdb(data : ActionDump){
	ActDB = data;
	Sounds = unflatten(Object.fromEntries(ActDB.sounds.map(sound => [sound.sound,sound.sound])),{delimiter: '_'});
}
export function oncode(data : Template, compareData : Template){
	code = data;
	compareTemplate = compareData;
}