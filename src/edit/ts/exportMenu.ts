import Menu from "../../main/menu";
import { code, exportTemplate } from "./edit";
import { codeutilities, cuopen, downloadDFT, snackbar, writeToClipboard } from "../../main/main";

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
    const data = exportTemplate(JSON.stringify(code));
    const altName = data.name.replace('"', '\\"').replace('\\', '\\\\').replace("'", "\\'");
    let copyData = "";
    if (e.shiftKey || e.ctrlKey) copyData = `/give minecraft:ender_chest{display:{Name:'{"text":"${altName}"}'},PublicBukkitValues:{"hypercube:codetemplatedata":'{name:"${altName}",code:"${data.code}",version:1,author:"${data.author}"}'}} 1`;
    else copyData = data.code;

    writeToClipboard(copyData, "Successfully copied data to clipboard.");
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
        if (JSON.parse(e.data).status === 'success') snackbar('Received confirmation for sent template');
    }
}
options.append(CodeUtilsSend);

const CopyGiveCommandButton = document.createElement('button');
CopyGiveCommandButton.innerText = 'Copy Give Command';
CopyGiveCommandButton.onclick = () => {
    const data = exportTemplate(JSON.stringify(code));
    const altName = data.name.replace('"', '\\"').replace('\\', '\\\\').replace("'", "\\'");
    writeToClipboard(`/give @p ender_chest{display:{Name:"\\"DFOnline Template\\""},PublicBukkitValues:{"hypercube:codetemplatedata":'{name:"${altName}",code:"${data.code}",version:1,author:"${data.author}"}'}`, "Successfully copied Give Command to clipboard.");
}
options.append(CopyGiveCommandButton);

const CopyLinkButton = document.createElement('button');
CopyLinkButton.innerText = 'Copy Link';
CopyLinkButton.onclick = async () => { // this code is for copying the link to the template, so you can share the template with others.
    const href = 'https://dfonline.dev/edit/';
    const searchParams = new URLSearchParams(location.search);
    const exportData = exportTemplate(JSON.stringify(code)).code;
    searchParams.set('template', exportData);
    writeToClipboard(`${href}?${searchParams.toString()}`, "Successfully copied link to clipboard.");
}
options.append(CopyLinkButton);

const CopyShortLinkButton = document.createElement('button');
CopyShortLinkButton.innerText = 'Copy Short Link (for Discord)';
CopyShortLinkButton.onclick = async () => {
    const href = 'https://dfonline.dev/edit/';
    const searchParams = new URLSearchParams(location.search);
    const exportData = exportTemplate(JSON.stringify(code)).code;
    searchParams.set('template', exportData);
    const url = href + '?' + searchParams.toString();
    writeToClipboard(`[code template](${url})`, "Successfully copied Discord Link to clipboard.");
}
options.append(CopyShortLinkButton);

const DownloadFileButton = document.createElement('button');

DownloadFileButton.innerText = 'Download File'
DownloadFileButton.onclick = () => {
    const exportData = exportTemplate(JSON.stringify(code)).code;
    downloadDFT(exportData, "template.dft");
}
options.append(DownloadFileButton);

exportDiv.append(options);
export default new Menu('Export', exportDiv);
export function update() {
    CodeUtilsSend.disabled = !cuopen;
}
