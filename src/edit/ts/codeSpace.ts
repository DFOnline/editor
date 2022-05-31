import { ActDB, backup, code, contextMenu, setAction, userMeta } from "../edit";
import { Block, Bracket, BracketType, DataBlock, SelectionBlock, SelectionBlocks, SelectionValues, SubActionBlock, Target } from "../../edit/template";
import { isDeveloperMode } from "../../main/main";
import { CodeBlockTypeName } from "./actiondump";
import { chestMenu } from "./chest/menu";
import HTMLCodeBlockElement from "./codeblock";

export function rendBlocks(){

	if(isDeveloperMode()) console.groupCollapsed('REND BLOCKS');

	const codeSpace = document.getElementById('codeBlocks') as HTMLDivElement;
	const messages = ["Boo.", "Boo, again!", "Hello.", "Hello!", "Call me bob the comment?", "Nice to meet you.", "GeorgeRNG :D", "What did the farmer say when he lost his tractor? Where's my tractor?", "Beyond that.", "Maybe it's gold.", "Au-.","The Moss.","Procrastination.","Typing Error"];
	codeSpace.innerHTML = `<!-- ${messages[Math.floor(Math.random() * messages.length)]} -->`; // hi
	
	/** How many brackets you have gone into */

	code.blocks.forEach((block,i) => {
		if(isDeveloperMode()) console.log(block);

		const blockDiv = new HTMLCodeBlockElement(block, i);

		codeSpace.append(blockDiv);
	})

	var end = document.createElement('div')
	end.classList.add('block');
	codeSpace.append(end);

	codeSpace.ondragover = e => {if(userMeta.type === 'newBlock'){e.preventDefault();e.stopPropagation();}};
	codeSpace.ondrop = e => {
		e.stopPropagation();
		if(userMeta.type === 'newBlock'){
			code.blocks.push(userMeta.value);
			rendBlocks();
		}
	}

	if(isDeveloperMode()) console.groupEnd();
}