import { encodeTemplate, user } from "../../main/main";
import { Argument, BlockTag, DataBlock, DataBlocks, PlacedBlock, SubActionBlock, Template } from "../template";
import ActDB, { Action, CodeBlockIdentifier, CodeBlockNameType, CodeBlockTypeName, subActionBlocks } from "./actiondump";
import 'drag-drop-touch';
import Names from './names';

export type tree = {
	[key: string]: tree | string;
}
/**
 * @deprecated Use `actiondump.ts` default export
 */
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

export const names = new Names();

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
	let block = code.blocks[index]
	if(block){
		if(block.id === 'block'){
			if((block as DataBlock).data || DataBlocks.includes((block as DataBlock).block)) (block as DataBlock).data = value;
			else if((block as SubActionBlock)){

				const action = actiondump.actions.find(act => (act.codeblockName === CodeBlockTypeName[(block as PlacedBlock).block as 'else'] && act.name === value)) // this is the action in db

				if(value !== '' && !ignoreInvalidAction && action === undefined) throw new TypeError(`Action ${value} doesn't exist on block type ${CodeBlockTypeName[(block as PlacedBlock).block as 'else']}`);

				else{
					(block as SubActionBlock).action = value;
					populateBlockTags(index,action);
				}
			}
			else throw new TypeError(`Block ${index} doesn't have a value.`)
		}
		else throw new TypeError(`Block ${index} is probably a ${block.id} which doesn't have a value.`)
	}
	else throw new RangeError(`Block ${index} doesn't exist.`)
}
export function populateBlockTags(index: number, action : Action){
	const block = code.blocks[index] as SubActionBlock;
	if(!block) throw ReferenceError(`Block at ${index} is out of bounds`); 
	if(block.id !== 'block') throw TypeError(`Block at ${index} is not a codeblock`); 
	// Clear previous tags
	block.args.items = block.args.items.filter(i => !((i.item.id === 'bl_tag') || (i.slot > 26 - action.tags.length )));
	action.tags.forEach((tag,i) => {
		const newTag : Argument<BlockTag> = {
			slot: (26 - i),
			item: {
				id: 'bl_tag',
				data: {
					action: action.name,
					block: CodeBlockNameType[action.codeblockName as 'CONTROL'],
					option: tag.defaultOption,
					tag: tag.name,
				}
			}
		}
		block.args.items.push(newTag);
	})
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
	return actiondump.actions.find(x => CodeBlockTypeName[block as 'else'] === x.codeblockName && (x.name === action || x.name === 'dynamic')).tags;
}

export function findBlockTag(block: CodeBlockIdentifier, action: String, tag: String){
	return findBlockTags(block,action).find(x => tag === x.name)
}

export function findBlockTagOption(block: CodeBlockIdentifier, action: String, tag: String, option: string){
	return findBlockTag(block,action,tag).options.find(x => x.name === option);
}

export function getCodeAction(actionName : string, types : subActionBlocks) {
	let names = types.map(t => actiondump.codeblocks.find(x => x.identifier === t).name);
	return actiondump.actions.find(x => x.name === actionName && names.includes(x.codeblockName));
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
	mouseInfo = document.querySelector('html body div#mouseinfo');
	console.log(mouseInfo);
	contextMenu = document.querySelector('div#context');
})
export function oncode(data : Template, compareData : Template){
	code = data;
	compareTemplate = compareData;
}

export const actiondump = await ActDB;