import ContextMenu from "../main/context";
import { snackbar } from "../main/main";
import Menu from "../main/menu";
import ActDB from "./ts/actiondump";
import { contextMenu, oncode, userMeta } from "./ts/edit";
import { BlockActionID, BlockDataID, Bracket, DATA_BLOCKS, DEFAULT_DATA_BLOCKS_TAGS, DataBlock, PhysicalBlock, SelectionBlock, loadTemplate } from "./template";
import { rendBlocks } from "./ts/codeSpace";
import menuBar from "./ts/menubar/menubar";

// when everything loads - this function is pretty hard to find lol.
try {
    Menu.setup();
    ContextMenu.setup();
}
catch (e) {
    snackbar('An error occured whilst setting up the editor. Check the console for more info.');
    console.error(e);
}

const urlParams = new URLSearchParams(location.search);

try {
    const templateParam = urlParams.get('template');
    const compareParam = urlParams.get('compare');
    if (templateParam) sessionStorage.setItem('import', templateParam.replace(/ /g, '+'));
    const templateImport = sessionStorage.getItem('import')!;
    const code = await loadTemplate(templateImport);
    const compareTemplate = compareParam ? await loadTemplate(compareParam.replace(/ /g, '+')) : undefined;
    if (compareParam) userMeta.canEdit = false;
    oncode(code, compareTemplate);
}
catch (e) {
    snackbar('An error occured whilst loading the template. Check the console for more info.');
    throw new Error(`${e}`);
}
rendBlocks();
contextMenu.onclick = () => {
    contextMenu.style.display = 'none';
    contextMenu.innerHTML = '';
    userMeta.ctxKeys = {};
    userMeta.search.index = 0;
    userMeta.search.value = undefined;
}
contextMenu.oncontextmenu = e => { (e.target! as HTMLElement).click(); e.preventDefault(); };

menuBar();

// console.log(ActDB.codeblocks.map(x => `${x.identifier} = "${x.name}"`).join(', '))
if (userMeta.canEdit) {
    try { rendBlocks(); }
    catch (e) {
        snackbar('An error occurred whilst displaying the blocks. For more info check console.');
        console.error(e);
    }
    const blockPicker = document.getElementById('blocks')!;
    ActDB.codeblocks.forEach(block => { // placing blocks menu
        const blockDiv = document.createElement('div');
        blockDiv.draggable = true;
        blockDiv.style.backgroundImage = `url(https://dfonline.dev/public/images/${block.item.material.toUpperCase()}.png)`;
        blockDiv.ondragstart = e => {
            e.stopPropagation();
            userMeta.type = 'newBlock';
            // god damn it
            const newBlocks: PhysicalBlock[] = [];
            if (block.identifier !== 'else') {
                // default block tags for data blocks
                if (DATA_BLOCKS.join(",").includes(block.identifier)) { // ts is weird sometimes
                    const newBlock: DataBlock = { block: block.identifier as BlockDataID, data: "", id: "block", args: { items: [] } };
                    DEFAULT_DATA_BLOCKS_TAGS[block.identifier as BlockDataID].forEach(x => newBlock.args.items.push(x));
                    newBlocks.push(newBlock);
                }
                else {
                    const newBlock: SelectionBlock = { id: "block", action: "", args: { items: [] }, block: block.identifier as BlockActionID, inverted: "", target: "" };
                    switch (block.identifier) {
                        case "control": newBlock.action = "Wait"; break;
                        case "set_var": newBlock.action = "="; break;
                        default: newBlock.action = "";
                    }
                    newBlocks.push(newBlock);
                }
            }
            if (block.identifier.includes('if') || block.identifier === 'else' || block.identifier === 'repeat') {
                // create and append a pair of brackets
                const openBracket: Bracket = { id: 'bracket', type: block.identifier === "repeat" ? "repeat" : 'norm', direct: 'open' };
                const closeBracket: Bracket = { id: 'bracket', type: block.identifier === "repeat" ? "repeat" : 'norm', direct: 'close' };
                newBlocks.push(openBracket, closeBracket);
            }
            userMeta.value = newBlocks;
        }
        blockPicker.appendChild(blockDiv);
    })
}

document.ondragstart = () => userMeta.canDragMove = false;
document.ondragend = () => userMeta.canDragMove = true;
document.ondrop = () => userMeta.canDragMove = true;
document.onclick = () => contextMenu.click();
document.onscroll = () => contextMenu.click();
document.ontouchmove = (e) => { if (!userMeta.canDragMove) { e.preventDefault(); } }
document.onkeydown = e => { if (userMeta.ctxKeys[e.key] !== undefined) { userMeta.ctxKeys[e.key].click() } }
