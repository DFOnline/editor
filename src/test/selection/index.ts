import ActionDump, { CodeBlockTypeName } from "../../edit/ts/actiondump";
import ContextMenu from "../../main/context";
import SelectionContext from "../../main/SelectionContext";

ContextMenu.setup();

const button = document.querySelector('button');

button.onclick = async e => {
    const type = CodeBlockTypeName.player_action;
    const values = Object.fromEntries((await ActionDump).actions.filter(a => a.codeblockName === type).map(a => [a.name,[...a.aliases,a.name]]));
    const ctx = new SelectionContext('Actions',values,true,false);
    ctx.toggle(e);
    ctx.callback = console.log;
}