import ActDB from "./actiondump";
import { backup, code, contextMenu, mouseInfo, populateBlockTags, setAction, userMeta } from "./edit";
import { ArgumentBlock, Block, DataBlock, DATA_BLOCKS, SelectionBlock, SELECTION_BLOCKS, SELECTION_VALUES, SubActionBlock, SUBACTION_BLOCKS, Target } from "../template";
import ActionDump, { CodeBlockTypeName, ItemTypeColors } from "./actiondump";
import chestMenu from "./chest/chestMenu";
import { rendBlocks } from "./codeSpace";
import ChestItem, { MCItem, isDefinedItem } from "./chest/item/chestitem";
import User from "../../main/user";
import sanitize from "sanitize-html";
import SelectionContext from "../../main/SelectionContext";
import ContextMenu from "../../main/context";

export default class HTMLCodeBlockElement extends HTMLDivElement {
    constructor(block: Block, i: number, bracketIndex: number) {
        super();

        this.index = i;
        this.id = 'block' + i;
        this.classList.add('block')

        this.ondragstart = e => {
            e.stopPropagation();
            userMeta.type = 'block';
            userMeta.value = i;
        }
        this.ondragover = e => { if (userMeta.type === 'block' || userMeta.type === 'newBlock') { e.preventDefault(); e.stopPropagation(); } };
        this.ondrop = this.dropevent;
        this.oncontextmenu = e => this.contextmenuevent(e, block);

        this.render(block, bracketIndex);

        if (!userMeta.canEdit) {
            this.draggable = false;
            this.oncontextmenu = () => false;
        }
    }

    index: number = 0;

    id: string = 'block' + String(this.index);
    className: string = 'block';
    draggable: boolean = true;

    // these comments are honestly quite incredible
    dropevent: (e: DragEvent) => void = e => { // and when you drop on a codeblock
        e.stopPropagation();

        let HTMLblock = backup(e.target as HTMLElement); // the HTML block you dropped on
        let id = (Number(HTMLblock.id.replace('block', ''))); // numerical id of the block dropped on

        if (id !== userMeta.value) {
            if (userMeta.type !== 'newBlock' && (Math.abs(id - userMeta.value) === 1 || e.shiftKey)) { // if it is next to the one you just used
                let swapData: Readonly<Block> = JSON.parse((JSON.stringify(code.blocks[userMeta.value]))); // the block you held
                code.blocks[userMeta.value] = code.blocks[id]; // and some swapping shenanagins
                code.blocks[id] = swapData; // it works so I got it correct
            }
            else {
                let { x: posX, width } = HTMLblock.getBoundingClientRect(); // x on screen as posX and witdh
                let pushSpot = (id + Number(e.clientX > (width / 2) + posX))
                if (userMeta.type !== 'newBlock') {
                    let data: Readonly<Block> = JSON.parse((JSON.stringify(code.blocks[userMeta.value]))); // get the block you held
                    code.blocks[userMeta.value]['id'] = 'killable'; // mark thing for deletion
                    code.blocks.splice(pushSpot, 0, data); // splice data in
                }
                else {
                    // add each value in userMeta.value into the codespace (in reverse order)
                    (userMeta.value as Block[]).reverse().forEach((insert) => { code.blocks.splice(pushSpot, 0, insert); });
                }
                code.blocks = code.blocks.filter(y => y.id !== "killable"); // remove the ones marked for deletion. If nothing marked, nothing gone.
            }
            rendBlocks();
        }
    }
    contextmenuevent = async (e: MouseEvent, block: Block) => { // the right click menu :D
        if (block.id !== 'killable') {
            e.preventDefault();
            contextMenu.innerHTML = '';
            contextMenu.style.left = String(e.clientX) + 'px';
            contextMenu.style.top = String(e.clientY) + 'px';
            contextMenu.style.display = 'grid';
            contextMenu.focus()
            if (block.id !== 'bracket') {
                if (block.block !== 'else') {

                    //#region value edit
                    let valuebutton;
                    let name = 'Block is invalid';
                    if (!DATA_BLOCKS.includes((block as DataBlock).block)) {
                        name = 'Action'
                        const values = Object.fromEntries((await ActionDump).actions.filter(a => a.codeblockName === CodeBlockTypeName[block.block]).map(a => [a.name, [...a.aliases, a.name]]));
                        const value = new SelectionContext(name, values, true, false);
                        value.callback = (name) => {
                            contextMenu.click();
                            setAction(this.index, name);
                            rendBlocks();
                        }
                        valuebutton = value.subMenu;
                    }
                    else {
                        const input = document.createElement('input');
                        name = 'Data';
                        input.onchange = () => {
                            contextMenu.click();
                            setAction(this.index, input.value, true);
                            rendBlocks();
                        }
                        input.onkeydown = e => e.stopImmediatePropagation();
                        const value = new ContextMenu(name, [input], false);
                        valuebutton = value.subMenu;
                    }
                    const valueButton = valuebutton;
                    //#endregion

                    userMeta.ctxKeys['a'] = valueButton;
                    contextMenu.append(valueButton);

                    if (SELECTION_BLOCKS.includes(block.block as typeof SELECTION_BLOCKS[number])) { // blocks which are supposed to have a target.
                        let targetButton = document.createElement('button');
                        targetButton.innerHTML = '<u>S</u>election';

                        targetButton.onclick = () => {
                            setTimeout(() => {
                                let target = document.createElement('select'); // selection
                                target.value = (block as SelectionBlock).target;
                                target.onclick = e => e.stopPropagation(); // allow clicking
                                SELECTION_VALUES.forEach(sel => { // create the options
                                    let option = document.createElement('option');
                                    option.value = sel;
                                    option.innerText = sel;
                                    target.append(option);
                                })
                                target.oninput = () => {
                                    (block as SelectionBlock).target = (target.value as Target);
                                    contextMenu.click();
                                    rendBlocks();
                                }
                                contextMenu.append(target);
                                contextMenu.style.display = 'grid'; // make ctx visible
                                setTimeout(() => target.click())
                            })
                        }

                        userMeta.ctxKeys['s'] = targetButton;
                        contextMenu.append(targetButton);
                    }
                    if (SUBACTION_BLOCKS.includes(block.block as any)) {
                        const subAction = (await ActionDump).actions.find(a => a.codeblockName === CodeBlockTypeName[block.block] && a.name === (block as SubActionBlock).action);
                        if (subAction) {
                            const subActions = subAction.subActionBlocks;
                            const acts = await ActionDump;
                            const types = !subActions ? [] : subActions.map(ActionType => {
                                const SubActionCategory = new SelectionContext(CodeBlockTypeName[ActionType], Object.fromEntries(acts.actions.filter(a => a.codeblockName === CodeBlockTypeName[ActionType]).map(a => [a.name, [...a.aliases, a.name]])), true, false);
                                SubActionCategory.callback = (ActionName) => {
                                    contextMenu.click();
                                    (block as SubActionBlock).subAction = ActionName;
                                    if (ActionType === 'if_player' && ActionName === 'HasRoomForItem') (block as SubActionBlock).subAction = 'PHasRoomForItem';
                                    rendBlocks();
                                    populateBlockTags(this.index, ActDB.actions.find(a => a.codeblockName === CodeBlockTypeName[ActionType] && a.name === ActionName)!);
                                }
                                return SubActionCategory.subMenu;
                            })
                            let subactionSearcher = new ContextMenu('Sub Actions', types, false);
                            contextMenu.append(subactionSearcher.subMenu);
                        }
                    }
                    if (block.block.includes('if_')) { // NOT button
                        let not = document.createElement('button');
                        not.innerHTML = '<u>N</u>OT';
                        not.onclick = () => {
                            const b = block as SelectionBlock;
                            b.attribute = (b.attribute == 'NOT' || b.inverted == 'NOT') ? '' : 'NOT';
                            b.inverted = b.attribute;
                            rendBlocks();
                        }
                        userMeta.ctxKeys['n'] = not;
                        contextMenu.append(not);
                    }
                    if (block.block.includes('event')) {
                        let lagslayerCancel = document.createElement('button');
                        if(lagslayerCancel.innerHTML = 'Lagslayer <u>C</u>ancel')
                        lagslayerCancel.onclick = () => {
                            const b = block as SelectionBlock;
                            b.attribute = b.attribute == 'LS-CANCEL' ? '' : 'LS-CANCEL';
                            rendBlocks();
                        }
                        userMeta.ctxKeys['c'] = lagslayerCancel;
                        contextMenu.append(lagslayerCancel);
                    }
                    contextMenu.append(document.createElement('hr'));
                }
            }
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<u>D</u>elete';
            deleteButton.onclick = () => {
                code.blocks.splice(this.index, 1);
                rendBlocks()
            }
            userMeta.ctxKeys['d'] = deleteButton;
            contextMenu.append(deleteButton);
        }
    }

    render: (block: Block, bracketIndex: number) => void = (block, bracketIndex) => {
        const stack = document.createElement('div');
        const topper = document.createElement('div');
        const blockElement = document.createElement('div');

        if (block.id === "block") {
            const chest = ['player_action', 'if_player', 'process', 'start_process', 'func', 'call_func', 'entity_action', 'if_entity', 'repeat', 'set_var', 'if_var', 'control', 'select_obj', 'game_action', 'if_game'].includes(block.block);
            topper.classList.add(chest ? 'chest' : 'air');
            if (chest) {
                topper.onclick = () => { chestMenu(this.index) }
                if (User.showItems) {
                    topper.onmouseenter = e => {
                        mouseInfo.style.display = 'block';
                        mouseInfo.innerHTML = '<u>Click to open chest menu</u>';
                        const items = (code.blocks[this.index] as ArgumentBlock).args.items;
                        if (items.length !== 0) mouseInfo.innerHTML += '<br /><hr />';
                        e.stopPropagation();
                        (code.blocks[this.index] as ArgumentBlock).args.items.forEach(arg => {
                            if (isDefinedItem(arg.item)) {
                                mouseInfo.innerHTML += `<b style="color: ${ItemTypeColors[arg.item.id]}">${arg.item.id.toUpperCase()}</b> `
                                if (arg.item.id === 'item') {
                                    mouseInfo.append(new MCItem(arg.item).minecraftName());
                                    mouseInfo.append(document.createElement('br'));
                                    return;
                                }
                            }
                            try { mouseInfo.innerHTML += `${sanitize(ChestItem.getItem(arg.item).repr())}<br>`; }
                            catch { mouseInfo.innerHTML += `<span style="color: red">%${arg.item.id}%</span><br>`; }
                        })
                    }
                    topper.onmousemove = e => {
                        e.stopPropagation();
                        mouseInfo.style.top = e.clientY + 'px';
                        mouseInfo.style.left = e.clientX + 'px';
                    }
                    topper.onmouseleave = () => {
                        mouseInfo.style.display = 'none';
                        mouseInfo.innerHTML = '';
                    }
                }
            }
            blockElement.classList.add(block.block, 'mat');
            if (block.block !== "else") {
                let sign = document.createElement('div');
                sign.classList.add('sign');

                let BlockType = document.createElement('span');
                BlockType.innerText = CodeBlockTypeName[block.block as 'player_action'];
                sign.append(BlockType);

                let ActionLine = document.createElement('span');
                ActionLine.innerText = block.block === "call_func" || block.block === "func" || block.block === "process" || block.block === "start_process" ? block.data : (block as SelectionBlock).action;
                sign.append(ActionLine);

                let SelectionLine = document.createElement('span');
                if ((block as SelectionBlock).target) {
                    SelectionLine.innerText = (block as SelectionBlock).target;
                } else if ((block as SubActionBlock).subAction) {
                    SelectionLine.innerText = (block as SubActionBlock).subAction;
                } else {
                    SelectionLine.innerText = "";
                }
                sign.append(SelectionLine);
                let not = document.createElement('span');
                not.innerText = (block as SelectionBlock).attribute ?? '';
                sign.append(not);
                blockElement.append(sign);
            }
            if (!(block.block === "if_entity" || block.block === "if_game" || block.block === "if_player" || block.block === "if_var" || block.block === "repeat" || block.block === "else")) {
                const stone = document.createElement('stone');
                stone.classList.add('stone');
                this.append(stone)
            }
        }
        else if (block.id === "bracket") {
            topper.classList.add('air');
            blockElement.classList.add('piston', 'mat', block.direct, block.type)
        }

        this.style.top = (bracketIndex * 30) + 'px';


        this.prepend(stack);
        stack.append(topper);
        stack.append(blockElement);
    }
}

customElements.define('df-block', HTMLCodeBlockElement, { extends: 'div' });
