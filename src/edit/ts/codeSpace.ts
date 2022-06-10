import { code, compareTemplate, userMeta } from "../edit";
import { isDeveloperMode } from "../../main/main";
import HTMLCodeBlockElement from "./codeblock";
import { diffArrays } from 'diff'

export function rendBlocks(){

	if(isDeveloperMode()) console.groupCollapsed('REND BLOCKS');

	const codeSpace = document.getElementById('codeBlocks') as HTMLDivElement;
	const messages = ["Boo.", "Boo, again!", "Hello.", "Hello!", "Call me bob the comment?", "Nice to meet you.", "GeorgeRNG :D", "What did the farmer say when he lost his tractor? Where's my tractor?", "Beyond that.", "Maybe it's gold.", "Au-.","The Moss.","Procrastination.","Typing Error"];
	codeSpace.innerHTML = `<!-- ${messages[Math.floor(Math.random() * messages.length)]} -->`; // hi
	
	/** How many brackets you have gone into */

	let bracketIndex = 0;

	if(compareTemplate){
		let i = 0;
		diffArrays(compareTemplate.blocks, code.blocks).forEach((diff) => {
			diff.value.forEach(block => {
				if(block.id === 'bracket' && block.direct === 'close') bracketIndex--;
				const blockDiv = new HTMLCodeBlockElement(block, i,bracketIndex);
				if(block.id === 'bracket' && block.direct === 'open') bracketIndex++;
				
				if(diff.added) blockDiv.style.outline = '2px solid green';
				if(diff.removed) blockDiv.style.outline = '2px solid red';

				codeSpace.append(blockDiv);
				
				i++;
			})
		})
	}
	else{
		code.blocks.forEach((block,i) => {
			if(isDeveloperMode()) console.log(block);

			
			if(block.id === 'bracket' && block.direct === 'close') bracketIndex--;
			const blockDiv = new HTMLCodeBlockElement(block, i,bracketIndex);
			if(block.id === 'bracket' && block.direct === 'open') bracketIndex++;

			codeSpace.append(blockDiv);
		})
	}
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