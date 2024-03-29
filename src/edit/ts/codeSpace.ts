import { code, compareTemplate, userMeta } from "./edit";
import { isDeveloperMode } from "../../main/developers";
import HTMLCodeBlockElement from "./HTMLCodeBlockElement";
import { diffArrays } from 'diff'
import type { Block } from "edit/template";
import User from "../../main/user";

export function rendBlocks() {

    if (isDeveloperMode()) console.groupCollapsed('REND BLOCKS');

    const codeSpace = document.getElementById('codeBlocks') as HTMLDivElement;
    const messages = ["Boo.", "Boo, again!", "Hello.", "Hello!", "Call me bob the comment?", "Nice to meet you.", "GeorgeRNG :D", "What did the farmer say when he lost his tractor? Where's my tractor?", "Beyond that.", "Maybe it's gold.", "Au-.", "The Moss.", "Procrastination.", "Typing Error", "oven was here"];
    codeSpace.innerHTML = `<!-- ${messages[Math.floor(Math.random() * messages.length)]} -->`; // hi

    /** How many brackets you have gone into */

    let bracketIndex = 0;

    if (compareTemplate) {
        // compare the objects
        const diffs = diffArrays(compareTemplate.blocks, code.blocks, { comparator: (a, b) => JSON.stringify(a) === JSON.stringify(b) });
        code.blocks = [];
        let i = 0;

        diffs.forEach((diff) => {
            diff.value.forEach(block => {
                if (block.id === 'bracket' && block.direct === 'close') bracketIndex--;
                const blockDiv = new HTMLCodeBlockElement(block, i, bracketIndex);
                if (block.id === 'bracket' && block.direct === 'open') bracketIndex++;

                // give it a green or red transparent background
                if (diff.added) blockDiv.style.backgroundColor = 'rgba(0,255,0,0.5)';
                if (diff.removed) blockDiv.style.backgroundColor = 'rgba(255,0,0,0.5)';

                codeSpace.append(blockDiv);

                i++;
                code.blocks.push(block);
            })
        })
    }
    else {
        code.blocks.forEach((block, i) => {
            if (isDeveloperMode()) console.log(block);

            if (block.id === 'bracket' && block.direct === 'close' && User.shiftBlocks) bracketIndex--;
            // make sure it is not below 0 (its called clamp silly)
            if (bracketIndex < 0) bracketIndex = 0;
            const blockDiv = new HTMLCodeBlockElement(block, i, bracketIndex);
            if (block.id === 'bracket' && block.direct === 'open' && User.shiftBlocks) bracketIndex++;

            codeSpace.append(blockDiv);
        })
    }
    let end = document.createElement('div')
    end.classList.add('block');
    codeSpace.append(end);

    codeSpace.ondragover = e => { if (userMeta.type === 'newBlock') { e.preventDefault(); e.stopPropagation(); } };
    codeSpace.ondrop = e => {
        e.stopPropagation();
        if (userMeta.type === 'newBlock') {
            userMeta.value.forEach((b: Block) => { code.blocks.push(b) });
            rendBlocks();
        }
    }

    if (isDeveloperMode()) console.groupEnd();
}
