import Menu from "../../main/menu";
import { code, exportTemplate } from "./edit";
import { codeutilities, cuopen, downloadDFT, snackbar } from "../../main/main";

const exportDiv = document.createElement('div');

const p = document.createElement('p');
p.innerText = `Get the template data${cuopen ? ', or send it to recode,' : ', or connect to recode to use the Item API,'} with the template you are currently working on.`;
exportDiv.append(p);

const options = document.createElement('div');
options.style.display = 'grid';
options.style.width = 'fit-content'

const copyTemplate = document.createElement('button');
copyTemplate.innerText = "Copy Data";
copyTemplate.onclick = e => {
    let data = exportTemplate(JSON.stringify(code));
    let altName = data.name.replace('"', '\\"').replace('\\', '\\\\').replace("'", "\\'");
    if (e.shiftKey || e.ctrlKey) navigator.clipboard.writeText(`/dfgive minecraft:ender_chest{display:{Name:'{"text":"${altName}"}'},PublicBukkitValues:{"hypercube:codetemplatedata":'{name:"${altName}",code:"${data.code}",version:1,author:"${data.author}"}'}} 1`);
    else navigator.clipboard.writeText(data.code);
}
options.append(copyTemplate);

const CodeUtilsSend = document.createElement('button');
CodeUtilsSend.innerText = 'Send to Recode';
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
        if (JSON.parse(e.data).status === 'success') snackbar('Recieved confirmation for sent template');
    }
}
options.append(CodeUtilsSend);

const CopyGiveCommandButton = document.createElement('button');
CopyGiveCommandButton.innerText = 'Copy Give Command';
CopyGiveCommandButton.onclick = () => {
    navigator.clipboard.writeText(`/give @p ender_chest{display:{Name:"\\"DFOnline Template\\""},PublicBukkitValues:{"hypercube:codetemplatedata":'${JSON.stringify(
        exportTemplate(JSON.stringify(code))
    )}'}}`)
}
options.append(CopyGiveCommandButton)

const CopyLinkButton = document.createElement('button');
CopyLinkButton.innerText = 'Copy Link';
CopyLinkButton.onclick = async () => { // this code is for copying the link to the template, so you can share the template with others.
    let href = 'https://dfonline.dev/edit/';
    let searchParams = new URLSearchParams(location.search);
    let exportData = exportTemplate(JSON.stringify(code)).code;
    searchParams.set('template', exportData);
    navigator.clipboard.writeText(href + '?' + searchParams.toString());
}
options.append(CopyLinkButton);

const CopyShortLinkButton = document.createElement('button');
// CopyShortLinkButton.innerText = 'Download File';
// CopyShortLinkButton.onclick = async e => {
//     const href = !e.shiftKey ? 'https://dfonline.dev/edit/' : 'https://diamondfire.gitlab.io/template/';
//     let searchParams = new URLSearchParams(location.search);
//     let exportData: string = (await fetch(`${window.sessionStorage.getItem('apiEndpoint')}save`, { body: exportTemplate(JSON.stringify(code)).code, method: 'POST' }).then(res => res.json())).id;
//     searchParams.set(e.shiftKey ? 't' : 'template', e.shiftKey ? 'dfo:' + exportData : exportData);
//     navigator.clipboard.writeText(href + '?' + searchParams.toString());
// }
CopyShortLinkButton.innerText = 'Download File'
CopyShortLinkButton.onclick = () => {
    const exportData = exportTemplate(JSON.stringify(code)).code;
    downloadDFT(exportData,"template.dft")
}
options.append(CopyShortLinkButton);

exportDiv.append(options);
export default new Menu('Export', exportDiv);
export function update() {
    CodeUtilsSend.disabled = !cuopen;
}
