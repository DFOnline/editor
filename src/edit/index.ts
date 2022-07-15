import ContextMenu from "../main/context";
import { snackbar, startup } from "../main/main";
import Menu from "../main/menu";
import { ActDB, contextMenu, onactdb, oncode, userMeta } from "./ts/edit";
import { Bracket, loadTemplate } from "./template";
import { rendBlocks } from "./ts/codeSpace";
import menuBar from "./ts/menubar/menubar";

window.onload = async function onload() { // when everything loads - this function is pretty hard to find lol.
	try {
		Menu.setup();
		ContextMenu.setup();
	}
	catch (e) {
		snackbar('An error occured whilst setting up the editor. Check the console for more info.');
		console.error(e);
	}

	let start
	try {
		start = startup();
	}
	catch (e) {
		snackbar('An error occured whilst starting up the editor. Check the console for more info.');
		console.error(e);
		return;
	}

	try {

		if(start.urlParams.has('template')){
			sessionStorage.setItem('import',start.urlParams.get('template').replace(/ /g,'+'));
		}
        let code, compareTemplate;
		if(sessionStorage.getItem('import')){
			let importTemplate = sessionStorage.getItem('import');
			code = await loadTemplate(importTemplate);
		}
		if(start.urlParams.get('compare')){
			compareTemplate = await loadTemplate(start.urlParams.get('compare').replace(/ /g,'+'));
			userMeta.canEdit = false;
		}
        oncode(code,compareTemplate);
	}
	catch (e) {
		snackbar('An error occured whilst loading the template. Check the console for more info.');
		console.error(e);
		return;
	}
	rendBlocks();
	contextMenu.onclick = () => {
		contextMenu.style.display = 'none';
		contextMenu.innerHTML = '';
		userMeta.ctxKeys = {};
		userMeta.search.index = 0;
		userMeta.search.value = undefined;
	}
	contextMenu.oncontextmenu = e => {(e.target as HTMLElement).click(); e.preventDefault();};

	menuBar();
}

fetch(`${sessionStorage.getItem('apiEndpoint')}db`) // Gets ?actiondump.
			.then(response => response.json()) // some code probably from mdn docs.
			.then(data => { // unready required init
				onactdb(data);
				// console.log(ActDB.codeblocks.map(x => `${x.identifier} = "${x.name}"`).join(', '))
				if(userMeta.canEdit){
					try{ rendBlocks(); }
					catch (e) {
						snackbar('An error occurred whilst displaying the blocks. For more info check console.');
						console.error(e);
					}
					const blockPicker = document.getElementById('blocks');
					ActDB.codeblocks.forEach(block => { // placing blocks menu
						const blockDiv = document.createElement('div');
						blockDiv.draggable = true;
						blockDiv.style.backgroundImage = `url(https://dfonline.dev/public/images/${block.item.material.toUpperCase()}.png)`;
						blockDiv.ondragstart = e => {
							e.stopPropagation();
							userMeta.type = 'newBlock';
							const newBlock: any =  {id: 'block', block: block.identifier /* lmao */}
							const newBlocks: any[] = [newBlock];
							if(block.identifier !== 'else'){
								newBlock.args = {'items':[]}
								if(block.identifier === 'func' || block.identifier === 'call_func' || block.identifier === 'process' || block.identifier === 'start_process'){
									newBlock.data = '';
									const func = [{"item": {"id": "bl_tag","data": {"option": "False","tag": "Is Hidden","action": "dynamic","block": "func"}},"slot": 26}];
									const call_func : undefined[] = [];
									const process = [{"item": {"id": "bl_tag","data": {"option": "False","tag": "Is Hidden","action": "dynamic","block": "process"}},"slot": 26}];
									const start_process = [{"item": {"id": "bl_tag","data": {"option": "Don't copy","tag": "Local Variables","action": "dynamic","block": "start_process"}},"slot": 25}, {"item": {"id": "bl_tag","data": {"option": "With current targets","tag": "Target Mode","action": "dynamic","block": "start_process"}},"slot": 26}];
									({call_func,func,process,start_process}[block.identifier]).forEach(x => newBlock.args.items.push(x))
								} 
								else if(block.identifier === 'control') newBlock.action = 'Wait';
								else if(block.identifier === 'set_var') newBlock.action = '=';
								else newBlock.action = '';
							}
							if(block.identifier.includes('if') || block.identifier === 'else' || block.identifier === 'repeat'){
								// create and append a pair of brackets
								const openBracket : Bracket = {id: 'bracket', type: 'norm', direct: 'open'};
								const closeBracket : Bracket = {id: 'bracket', type: 'norm', direct: 'close'};
								if(block.identifier === 'repeat'){
									openBracket.type = 'repeat';
									closeBracket.type = 'repeat';
								}
								newBlocks.push(openBracket,closeBracket);
							}
							userMeta.value = newBlocks;
						}
						blockPicker.appendChild(blockDiv);
					})
					}
			})
			.catch(e => {
				// if it is 500, it means the backend server is down.
				if(e.status === 500){
					snackbar('Backend server is down. Please try again later.')
				}
				else{
					snackbar('An error occured. For more info check console.')
				}
				console.error(e);
			})

document.ondragstart = () => userMeta.canDragMove = false;
document.ondragend = () =>  userMeta.canDragMove = true;
document.ondrop = () =>  userMeta.canDragMove = true;
document.ontouchmove = (e) => {if(!userMeta.canDragMove){e.preventDefault();}}
document.onclick = () => contextMenu.click()
document.onscroll = () => contextMenu.click()
document.onkeydown = e => { if(userMeta.ctxKeys[e.key] !== undefined){ userMeta.ctxKeys[e.key].click() } }