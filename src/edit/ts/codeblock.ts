import { ActDB, backup, code, contextMenu, setAction, userMeta } from "./edit";
import { Block, DataBlock, SelectionBlock, SelectionBlocks, SelectionValues, SubActionBlock, Target } from "../../edit/template";
import { CodeBlockTypeName } from "./actiondump";
import chestMenu from "./chest/chestMenu";
import { rendBlocks } from "./codeSpace";

export default class HTMLCodeBlockElement extends HTMLDivElement {
    constructor (block : Block, i : number, bracketIndex : number) {
        super();

        this.index = i;
        this.id = 'block' + i;
        this.classList.add('block')

        this.ondragstart = e => {
            e.stopPropagation();
            userMeta.type = 'block';
            userMeta.value = i;
        }
        this.ondragover = e => {if(userMeta.type === 'block' || userMeta.type === 'newBlock'){e.preventDefault();e.stopPropagation();}};
        this.ondrop = this.dropevent;
        this.oncontextmenu = e => this.contextmenuevent(e, block);

        this.render(block, bracketIndex);

		if(!userMeta.canEdit){
			this.draggable = false;
			this.oncontextmenu = () => false;
		}
    }

    index : number = 0;

    id: string = 'block' + String(this.index);
    className: string = 'block';
    draggable: boolean = true;

    dropevent : (e : DragEvent) => void = e => { // and when you drop on a codeblock
        e.stopPropagation();

        var HTMLblock = backup(e.target as HTMLElement); // the HTML block you dropped on
        var id = (Number(HTMLblock.id.replace('block',''))); // numerical id of the block dropped on

        if(id !== userMeta.value){
            if(userMeta.type !== 'newBlock' && (Math.abs(id - userMeta.value) === 1 || e.shiftKey)){ // if it is next to the one you just used
                var swapData = JSON.parse((JSON.stringify(code.blocks[userMeta.value]))) as Readonly<Block>; // the block you held
                code.blocks[userMeta.value] = code.blocks[id]; // and some swapping shenanagins
                code.blocks[id] = swapData; // it works so I got it correct
            }
            else {
                var {x:posX,width} = HTMLblock.getBoundingClientRect(); // x on screen as posX and witdh
                var pushSpot = (id + Number(e.clientX > (width / 2) + posX))
                if(userMeta.type !== 'newBlock'){
                    var data = JSON.parse((JSON.stringify(code.blocks[userMeta.value]))) as Readonly<Block>; // get the block you held
                    code.blocks[userMeta.value]['id'] = 'killable'; // mark thing for deletion
                    code.blocks.splice(pushSpot,0,data); // splice data in
                }
                else{
                    // add each value in userMeta.value into the codespace (in reverse order)
                    (userMeta.value as Block[]).reverse().forEach((insert) => {code.blocks.splice(pushSpot,0,insert);});
                }
                code.blocks = code.blocks.filter(y => y.id !== "killable"); // remove the ones marked for deletion. If nothing marked, nothing gone.
            }
            rendBlocks();
        }
    }
    contextmenuevent : (e : MouseEvent, block : Block) => void = (e, block) => { // the right click menu :D
        if(block.id !== 'killable'){
            e.preventDefault();
            contextMenu.innerHTML = '';
            contextMenu.style.left = String(e.clientX) + 'px';
            contextMenu.style.top = String(e.clientY) + 'px';
            contextMenu.style.display = 'grid';
            contextMenu.focus()
            if(block.id !== 'bracket'){
                if(block.block !== 'else'){

                    var valueButton = document.createElement('button');
                    if((block as DataBlock).data !== undefined) valueButton.innerHTML = 'D<u>a</u>ta';
                    if((block as SelectionBlock).action !== undefined || (block as SubActionBlock).subAction !== undefined) valueButton.innerHTML = '<u>A</u>ction'

                    valueButton.onclick = () => { // YEEE CONTEXT FOR EDITING ACTIONS
                        setTimeout(() => {
                            contextMenu.style.display = 'grid';
                                var value = document.createElement('input');
                                if((block as DataBlock).data === undefined){ // default action type block.
                                    value.value = (block as SelectionBlock | SubActionBlock).action;
                                    var results = document.createElement('div');
                                    let pre = value.value.substring(value.selectionStart,0);
                                    value.onkeydown = e => { // ENTER, ESCAPE AND TAB
                                        if(e.key === 'Enter'){
                                            setAction(this.index,value.value);
                                            contextMenu.click();
                                            rendBlocks();
                                        }
                                        else if(e.key === 'Escape'){
                                            contextMenu.click();
                                        }
                                        else if(e.key === 'Tab'){
                                            e.preventDefault();
                                            if(userMeta.search.value.length !== 0){
                                                value.value = userMeta.search.value[userMeta.search.index].name;
                                                value.setSelectionRange(pre.length,value.value.length);
                                                userMeta.search.index = (1 + userMeta.search.index) % userMeta.search.value.length;
                                            }
                                        }
                                        else if(e.key === 'Backspace') pre = value.value.substring(value.selectionStart + 1,0);
                                        else{
                                            userMeta.search.value = undefined;
                                            pre = value.value.substring(value.selectionStart,0);
                                        }
                                    }
                                    value.oninput = () => { // EVERYTHING ELSE THAT YOU TYPE
                                        results.innerHTML = '';
                                        if(value.value.length - pre.length >= 0){
                                            userMeta.search.value = ActDB.actions.filter(x => x.codeblockName === CodeBlockTypeName[block.block] && x.icon.description.length !== 0).filter(x => x.name.toLowerCase().startsWith(value.value.toLowerCase()));
                                            userMeta.search.index = 0;
                                            if(userMeta.search.value.length !== 0){
                                                var length = value.value.length;
                                                value.value = userMeta.search.value[userMeta.search.index].name;
                                                value.setSelectionRange(length,value.value.length);
                                                userMeta.search.index = (1 + userMeta.search.index) % userMeta.search.value.length;
                                                userMeta.search.value.forEach(v => {
                                                    var res = document.createElement('button');
                                                    res.innerText = v.name;
                                                    res.onclick = () => {
                                                        (block as SelectionBlock | SubActionBlock).action = v.name;
                                                        rendBlocks()
                                                    }
                                                    results.append(res);
                                                    results.append(document.createElement('br'));
                                                })
                                            }
                                            else userMeta.search.value = undefined;
                                        }
                                        pre = value.value.substring(value.selectionStart,0);
                                    }
                                    contextMenu.append(results);
                                }
                                else { // data type block.
                                    value.value = (block as DataBlock).data
                                    value.onkeydown = e => {
                                        if(e.key === 'Enter'){
                                            (block as DataBlock).data = value.value;
                                            contextMenu.click();
                                            rendBlocks();
                                        }
                                        else if(e.key === 'Escape'){
                                            contextMenu.click();
                                        }
                                    }
                                }
                                value.onclick = e => { e.stopPropagation(); }
                                contextMenu.prepend(value);
                                value.focus()
                        })
                    }

                    userMeta.ctxKeys['a'] = valueButton;
                    contextMenu.append(valueButton);

                    if(SelectionBlocks.includes(block.block)){ // blocks which are supposed to have a target.
                        var targetButton = document.createElement('button');
                        targetButton.innerHTML = '<u>S</u>election';

                        targetButton.onclick = () => {
                            setTimeout(() => {
                                var target = document.createElement('select'); // selection
                                target.value = (block as SelectionBlock).target;
                                target.onclick = e => e.stopPropagation(); // allow clicking
                                SelectionValues.forEach(sel => { // create the options
                                    var option = document.createElement('option');
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
                    if(block.block.includes('if_')){ // NOT button
                        var not = document.createElement('button');
                        not.innerHTML = '<u>N</u>OT';
                        not.onclick = () => {
                            (block as SelectionBlock).inverted = (block as SelectionBlock).inverted === 'NOT' ? '' : 'NOT';
                            rendBlocks();
                        }
                        userMeta.ctxKeys['n'] = not;
                        contextMenu.append(not);
                    }
                    contextMenu.append(document.createElement('hr'));
                }
            }
            var deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<u>D</u>elete';
            deleteButton.onclick = () => {
                code.blocks.splice(this.index,1);
                rendBlocks()
            }
            userMeta.ctxKeys['d'] = deleteButton;
            contextMenu.append(deleteButton);
        }
    }

    render : (block : Block, bracketIndex : number) => void = (block, bracketIndex) => {
        const stack = document.createElement('div');
        const topper = document.createElement('div');
        const blockElement = document.createElement('div');

        if(block.id === "block"){
			const chest = ['player_action','if_player','process','start_process','func','entity_action','if_entity','repeat','set_var','if_var','control','select_obj','game_action','if_game'].includes(block.block);
			topper.classList.add(chest ? 'chest' : 'air');
			if(chest){
				topper.onclick = () => {chestMenu(this.index)}
			}
			blockElement.classList.add(block.block, 'mat');
			if(block.block !== "else"){
				var sign = document.createElement('div');
				sign.classList.add('sign');

				var BlockType = document.createElement('span');
				BlockType.innerText = CodeBlockTypeName[block.block];
				sign.append(BlockType);

				var ActionLine = document.createElement('span');
				ActionLine.innerText = block.block === "call_func" || block.block === "func" || block.block === "process" || block.block === "start_process" ? block.data : (block as SelectionBlock).action;
				sign.append(ActionLine);

				var SelectionLine = document.createElement('span');
				if((block as SelectionBlock).target){
					SelectionLine.innerText = (block as SelectionBlock).target;
				} else if((block as SubActionBlock).subAction){
					SelectionLine.innerText = (block as SubActionBlock).subAction;
				} else {
					SelectionLine.innerText = "";
				}
				sign.append(SelectionLine);
				var not = document.createElement('span');
				not.innerText = (block as SelectionBlock).inverted ? (block as SelectionBlock).inverted : "";
				sign.append(not);
				blockElement.append(sign);
			}
			if(!(block.block === "if_entity" || block.block === "if_game" || block.block === "if_player" || block.block === "if_var" || block.block === "repeat" || block.block === "else")){
				const stone = document.createElement('stone');
				stone.classList.add('stone');
				this.append(stone)
			}
		}
		else if(block.id === "bracket"){
			topper.classList.add('air');
			blockElement.classList.add('piston','mat',block.direct,block.type)
		}

        this.style.top = (bracketIndex * 30) + 'px';

        this.prepend(stack);
		stack.append(topper);
		stack.append(blockElement);
    }
}

customElements.define('df-block', HTMLCodeBlockElement, { extends: 'div' });


		
// this.style.position = 'relative';