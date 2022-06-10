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
		// compare the objects
		const compareObjects = (obj1: any, obj2: any) =>{
			if(obj1 === obj2) return true;
			if(obj1 == null || obj2 == null) return false;
			if(obj1.constructor !== obj2.constructor) return false;
			for(let key in obj1){
				if(!compareObjects(obj1[key], obj2[key])) return false;
			}
			return true;
		}

		const diffs = diffArrays(compareTemplate.blocks, code.blocks, {comparator: compareObjects});
		let i = 0;

		diffs.forEach((diff) => {
			diff.value.forEach(block => {
				if(block.id === 'bracket' && block.direct === 'close') bracketIndex--;
				const blockDiv = new HTMLCodeBlockElement(block, i,bracketIndex);
				if(block.id === 'bracket' && block.direct === 'open') bracketIndex++;
				
				// give it a green or red transparent background
				if(diff.added) blockDiv.style.backgroundColor = 'rgba(0,255,0,0.5)';
				if(diff.removed) blockDiv.style.backgroundColor = 'rgba(255,0,0,0.5)';

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