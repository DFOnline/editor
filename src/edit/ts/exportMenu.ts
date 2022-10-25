import Menu from "../../main/menu";
import { code, exportTemplate } from "./edit";
import { codeutilities, cuopen, snackbar } from "../../main/main";

const exportDiv = document.createElement('div');

const p = document.createElement('p');
p.innerText = `Get the template data${cuopen ? ', or send it to codeutilities,' : ', or connect to codeutilities to use the Item API,'} with the template you are currently working on.`;
exportDiv.append(p);

const options = document.createElement('div');
options.style.display = 'grid';
options.style.width = 'fit-content'

const copyTemplate = document.createElement('button');
copyTemplate.innerText = "Copy Data";
copyTemplate.onclick = e => {
    let data = exportTemplate(JSON.stringify(code));
    let altName = data.name.replace('"','\\"').replace('\\','\\\\').replace("'","\\'");
    if(e.shiftKey || e.ctrlKey) navigator.clipboard.writeText(`/dfgive minecraft:ender_chest{display:{Name:'{"text":"${altName}"}'},PublicBukkitValues:{"hypercube:codetemplatedata":'{name:"${altName}",code:"${data.data}",version:1,author:"${data.author}"}'}} 1`);
    else navigator.clipboard.writeText(data.data);
}
options.append(copyTemplate);

const CodeUtilsSend = document.createElement('button');
CodeUtilsSend.innerText = 'Send to CodeUtilities';
CodeUtilsSend.disabled = !cuopen;
CodeUtilsSend.onclick = () => { // the code for sending :D
    codeutilities.send(JSON.stringify(
        {
            type: 'template',
            data: JSON.stringify(exportTemplate(JSON.stringify(code))),
            source: 'DFOnline'
        }
    ));
    codeutilities.onmessage = e => {
        if(JSON.parse(e.data).status === 'success') snackbar('Recieved confirmation for sent template');
    }
}
options.append(CodeUtilsSend);



const CopyLinkButton = document.createElement('button');
CopyLinkButton.innerText = 'Copy Link';
CopyLinkButton.onclick = async e => { // this code is for copying the link to the template, so you can share the template with others.
    let href = 'https://dfonline.dev/edit/';
    let searchParams = new URLSearchParams(location.search);
    let exportData = exportTemplate(JSON.stringify(code)).data;
    searchParams.set('template',exportData);
    navigator.clipboard.writeText(href + '?' + searchParams.toString());
}
options.append(CopyLinkButton);

const CopyShortLinkButton = document.createElement('button');
CopyShortLinkButton.innerText = 'Copy Short Link';
CopyShortLinkButton.onclick = async e => {
    let href = 'https://dfonline.dev/edit/';
    if(e.shiftKey) href = 'https://diamondfire.gitlab.io/template/';
    let searchParams = new URLSearchParams(location.search);
    let exportData : string = (await fetch(`${window.sessionStorage.getItem('apiEndpoint')}save`,{'body':exportTemplate(JSON.stringify(code)).data,'method':'POST'}).then(res => res.json())).id;
    searchParams.set(e.shiftKey ? 't' : 'template',e.shiftKey ? 'dfo:' + exportData : exportData);
    navigator.clipboard.writeText(href + '?' + searchParams.toString());
}
options.append(CopyShortLinkButton);

exportDiv.append(options);
export default new Menu('Export',exportDiv);
export function update(){
    CodeUtilsSend.disabled = !cuopen;
}
