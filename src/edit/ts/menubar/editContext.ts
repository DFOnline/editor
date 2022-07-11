import { code } from "../edit";
import type { SubActionBlock, SelectionBlock, VarScope } from "../../template";
import { snackbar } from "../../../main/main";
import Menu from "../../../main/menu";
import ContextMenu from "../../../main/context";

var renameVars = document.createElement('button');
renameVars.innerText = 'Rename All Variables';
renameVars.onclick = () => {
    editContext.close();

    var menuDiv = document.createElement('div');
    menuDiv.style.display = 'grid';

    var lookValue = document.createElement('input');
    lookValue.placeholder = 'Variable Name';
    menuDiv.append(lookValue);

    var replaceValue = document.createElement('input');
    replaceValue.placeholder = 'New Name'
    menuDiv.append(replaceValue);

    var scopeValue = document.createElement('select');
    var opt = document.createElement('option');
    opt.value = 'unsaved';
    opt.text = 'GAME';
    scopeValue.append(opt);
    opt = document.createElement('option');
    opt.value = 'save';
    opt.text = 'SAVE';
    scopeValue.append(opt);
    opt = document.createElement('option');
    opt.value = 'local';
    opt.text = 'LOCAL';
    scopeValue.append(opt);
    menuDiv.append(scopeValue);
    menuDiv.append(document.createElement('br'));


    {
        var replace = document.createElement('button');
        replace.innerText = 'Rename All'
        replace.onclick = () => {
            let results = 0;
            code.blocks = code.blocks.map(e => {
                var newBlock = e;
                if((e as SubActionBlock).args !== undefined){
                    (e as SelectionBlock).args.items = (e as SelectionBlock).args.items.map(x => {
                        var newItem = x;
                        if(newItem.item.id === 'var' && newItem.item.data.scope === (scopeValue.value as VarScope) && newItem.item.data.name === lookValue.value){
                            newItem.item.data.name = replaceValue.value;
                            results++;
                        }
                        return newItem
                    })
                }
                return newBlock;
            })
            snackbar(`Found ${results} variables.`)
        }
        menuDiv.append(replace);
    }
    new Menu('Rename All Variables',menuDiv).open();

}

const editContext = new ContextMenu('Edit',[renameVars]);
export default editContext;