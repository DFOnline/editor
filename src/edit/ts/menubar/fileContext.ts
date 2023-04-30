import ContextMenu from "../../../main/context";
import { createMenu } from "../../../home/home";
import exportMenu, { update } from "../exportMenu";
import { templateLike } from "../../../main/main";
import Menu from "../../../main/menu";

const save = document.createElement('button');
save.innerText = 'Save';
save.disabled = true;

const newTemplate = document.createElement('button');
newTemplate.innerText = 'New Template';
newTemplate.onclick = () => {
    context.close();
    createMenu.open();
}

const exportTemplateButton = document.createElement('button'); // this variable contains a HTMLButtonElement, this variable is futher filled with the inner text (the text that shows in the button) to say 'Export'. This button is used to export the template, so when you click it you get various options for export the template, such as copying the internal data, the give command and sending it the the minecraft mod CodeUtilties throught the inbuilt Item API. The item API is an Application Programming Interface for minecraft, to send things like minecraft items and templates to minecraft, and DiamondFire (a server for making minigames in minecraft with blocks) templates to anything listening through the API. // recode moment
exportTemplateButton.innerText = 'Export';
exportTemplateButton.onclick = async () => {
    context.close();
    exportMenu.open();
    update();
}

const comparison = document.createElement('button');
comparison.innerText = 'Compare';
comparison.onclick = () => {
    context.close();
    const comparisonDiv = document.createElement('div');


    // A link to the export menu
    const a = document.createElement('a');
    a.href = '#';
    a.innerText = 'Export';
    a.onclick = () => {
        exportMenu.open();
    }
    comparisonDiv.append(a);

    const p = document.createElement('p');
    p.innerHTML = 'Compare templates and show the changes made to them<br> You might want to get short link data from the export menu.';
    comparisonDiv.append(p);

    const cleanPaste = (e: ClipboardEvent) => {
        if (!e.clipboardData) throw new Error("Unable to access clipboard data.");
        const text = e.clipboardData.getData('text/plain');
        const Input = e.target as HTMLInputElement;
        // if the clipboard is a link with the template parameter
        const params = new URLSearchParams(text.replace(/^.*(?=\?)/g, ''));
        const templateParam = params.get('template');
        if (templateParam) {
            e.preventDefault();
            Input.value = templateParam;
        }
        // if the clipboard is data with template data
        const templateMatch = text.match(templateLike);
        if (templateMatch) {
            e.preventDefault();
            Input.value = templateMatch[0];
        }
    }

    const params = new URLSearchParams(location.search);

    const oldTemplate = document.createElement('input');
    oldTemplate.type = 'text';
    oldTemplate.placeholder = 'Old Template';
    // if the url has a template parameter, it will be used as the old template.
    if (params.has('template')) oldTemplate.value = params.get('template')!;
    oldTemplate.onpaste = cleanPaste;

    const newTemplate = document.createElement('input');
    newTemplate.type = 'text';
    newTemplate.placeholder = 'New Template';
    newTemplate.onpaste = cleanPaste;

    const compareButton = document.createElement('button');
    compareButton.innerText = 'Compare';
    compareButton.onclick = () => {
        // the settings are set by urlparams
        // `compare` is for the old one
        // `template` is for the new one

        const searchParams = new URLSearchParams('');
        searchParams.set('compare', oldTemplate.value);
        searchParams.set('template', newTemplate.value);
        // send them to the url
        location.search = searchParams.toString();
    }

    comparisonDiv.append(oldTemplate);
    comparisonDiv.append(newTemplate);
    comparisonDiv.append(compareButton);

    new Menu('Compare', comparisonDiv).open();
}


const context = new ContextMenu('File', [save, newTemplate, exportTemplateButton, comparison]);
export default context;
