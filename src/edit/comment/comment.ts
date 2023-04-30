import { codeutilities, encodeTemplate } from "../../main/main";
import type { Inverted, Target, Template } from "../template";

window.onload = () => {
    (document.getElementById('send')! as HTMLButtonElement).onclick = generateTheComment;
}

window.onkeydown = event => {
    if (event.key === "Enter") (document.getElementById('send')! as HTMLButtonElement).click();
    if (event.key === "ArrowDown") nextElement(1);
    if (event.key === "ArrowUp") nextElement(-1);
}

function generateTheComment() {
    const code: Template = { blocks: [{ id: "block", block: "control", args: { "items": [] }, action: "", target: "", inverted: "" }] };
    const b = code['blocks'][0];
    if ("action" in b) b.action = (document.getElementById('action') as HTMLInputElement).value;
    if ("target" in b) b.target = (document.getElementById('target') as HTMLInputElement).value as Target;
    if ("inverted" in b) b.inverted = (document.getElementById('inverted') as HTMLInputElement).value as Inverted;
    codeutilities.send(
        JSON.stringify(
            {
                type: "template", source: "DFOnline Comment Generator", data:
                    JSON.stringify({ name: "§6Comment", data: encodeTemplate(JSON.stringify(code)) })
            }
        )
    );
}


function nextElement(move = 1) {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.comment'));
    const current = elements.findIndex(x => x === document.activeElement);
    const newIndex = (current + move) % elements.length < 0 ? elements.length - 1 : (current + move) % elements.length;
    elements[newIndex].focus();
}
