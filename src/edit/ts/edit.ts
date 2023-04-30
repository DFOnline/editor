import { encodeTemplate, user } from "../../main/main";
import { Argument, BlockTag, DATA_BLOCKS, SubActionBlock, Template } from "../template";
import ActDB, { Action, CodeBlockIdentifier, CodeBlockNameType, CodeBlockTypeName, subActionBlocks } from "./actiondump";
import 'drag-drop-touch';
import Names from './names';

export interface TreeStructure {
    [key: string]: TreeStructure | string; // (oven) i didn't know ts allowed recursive types
}
export interface UserMetaObject {
    type?: 'block' | 'item' | 'newBlock' | undefined, value?: any | undefined,
    ctxKeys: Record<string, HTMLButtonElement>, search: { index: number, value: undefined | any[] },
    canDragMove: boolean, context: boolean, canEdit: boolean
}

export let Sounds: TreeStructure
export let compareTemplate: Template | undefined;
export let code: Template = { blocks: [] };
export let userMeta: UserMetaObject = {
    type: undefined, value: undefined,
    ctxKeys: {}, search: { index: 0, value: undefined },
    canDragMove: true, context: false, canEdit: true
};

/**
 * @deprecated Use new `ContextMenu` instead.
 */
export let contextMenu = document.querySelector<HTMLDivElement>('div#context')!;
export let mouseInfo = document.querySelector<HTMLDivElement>('html body div#mouseinfo')!;
console.log(mouseInfo);

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
export function setAction(index: number, value: string, ignoreInvalidAction = false) {
    const block = code.blocks[index]
    if (block) {
        if (block.id === 'block') {
            if ("data" in block && DATA_BLOCKS.includes(block.block)) block.data = value;
            else if (block) {

                const action = ActDB.actions.find(act => (act.codeblockName === CodeBlockTypeName[block.block] && act.name === value)) // this is the action in db

                if (!ignoreInvalidAction && !action) throw new TypeError(`Action ${value} doesn't exist on block type ${CodeBlockTypeName[block.block]}`);
                if (!action) return;

                else {
                    if ("action" in block) block.action = value;
                    populateBlockTags(index, action);
                }
            }
            else throw new Error(`Block ${index} doesn't have a value.`)
        }
        else throw new TypeError(`Block ${index} is probably a ${block.id} which doesn't have a value.`)
    }
    else throw new RangeError(`Block ${index} doesn't exist.`)
}
export function populateBlockTags(index: number, action: Action) {
    const block = code.blocks[index] as SubActionBlock;
    if (!block) throw ReferenceError(`Block at ${index} is out of bounds`);
    if (block.id !== 'block') throw TypeError(`Block at ${index} is not a codeblock`);
    // Clear previous tags
    block.args.items = block.args.items.filter(i => !((i.item.id === 'bl_tag') || (i.slot > 26 - action.tags.length)));
    action.tags.forEach((tag, i) => {
        const newTag: Argument<BlockTag> = {
            slot: (26 - i),
            item: {
                id: 'bl_tag',
                data: { action: action.name, block: CodeBlockNameType[action.codeblockName], option: tag.defaultOption, tag: tag.name }
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
export function backup(element: HTMLElement): HTMLDivElement {
    if (element.classList.contains('block')) {
        return element as HTMLDivElement;
    } else {
        return backup(element.parentNode as HTMLElement)
    }
}

export function findBlockTags(block: CodeBlockIdentifier, action: string) {
    return ActDB.actions.find(x => CodeBlockTypeName[block] === x.codeblockName && (x.name === action || x.name === 'dynamic'))?.tags || [];
}

export function findBlockTag(block: CodeBlockIdentifier, action: string, tag: string) {
    return findBlockTags(block, action).find(x => tag === x.name)
}

export function findBlockTagOption(block: CodeBlockIdentifier, action: string, tagName: string, option: string) {
    const tag = findBlockTag(block, action, tagName);
    if (!tag) return;
    return tag.options.find(x => x.name === option);
}

export function getCodeAction(actionName: string, types: subActionBlocks) {
    let names = types.map(t => ActDB.codeblocks.find(x => x.identifier === t)?.name).filter(Boolean); // pass in boolean constructor as predicate function
    return ActDB.actions.find(x => x.name === actionName && names.includes(x.codeblockName));
}

/**
 * This exports that code and various info about it in an object.
 * @param code Stringified version of a template to compile
 * @returns data: contains the gzip template data, author: Who created the template, name: the name of the template
 */
export function exportTemplate(code: string): { data: string, author: string, name: string; } {
    let name: string;
    if (user && user.name) name = user.name;
    else name = 'DFOnline';
    return ({
        data: encodeTemplate(code), // lmao what I probably rename some variables and never saw this happen
        author: name,
        name: 'DFOnline Template', // proper name system planned later
    })
}

export function oncode(data: Template, compareData?: Template) {
    code = data;
    compareTemplate = compareData;
}
