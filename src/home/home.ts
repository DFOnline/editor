import Menu from "../main/menu";
import { snackbar, templateLike } from "../main/main"
import { fetchTemplate, loadTemplate } from "../edit/template";

Menu.setup();

// function importMenu(code = ""){
//     let div = document.createElement('div');

//     let toptext = document.createElement('p');
//     toptext.innerText = `If you have your code template data, just paste it in. Press the import button, and start editing.`;
//     div.appendChild(toptext);

//     let imports = document.createElement('div');
//     let importField = document.createElement('input');
//     importField.type = "text";
//     importField.placeholder = "Template Data";
//     importField.onkeyup = event => {if(event.key === "Enter"){activateImport.click()}}
//     importField.id = "importfield";
//     importField.value = code;
//     imports.appendChild(importField);

//     let activateImport = document.createElement('button')
//     activateImport.innerText = "Go!"
//     activateImport.style.marginLeft = "5px"
//     activateImport.onclick = () => {
//         let data = importField.value.match(templateLike);
//         if(data !== null){
//             sessionStorage.setItem('import',data[0]); location.href = `/edit/`;
//         }
//     }
//     imports.appendChild(activateImport)
//     div.appendChild(imports)
//     if(cuopen){
//         let cuad = document.createElement('p')
//         cuad.innerText = "Or, because you have recode you can go into minecraft, hold your template and type /sendtemplate!"
//         div.appendChild(cuad)
//     }
//     menu('Import',div)
// }

export class ImportMenu extends Menu {
    constructor(code = '') {
        const content = document.createElement('div');
        const p = document.createElement('p');
        p.innerText = `If you have your code template data, just paste it in. Press the import button, and start editing.`;
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Template Data';
        input.onkeyup = event => { if (event.key === 'Enter') { activateImport.click() } }
        input.value = code;
        const activateImport = document.createElement('button');
        activateImport.innerText = 'Import';
        activateImport.onclick = async () => {
            loadTemplate(input.value);
            const data = input.value.match(templateLike);
            if (data !== null) {
                sessionStorage.setItem('import', (await fetchTemplate(input.value))!); window.open("../edit/", "_self");
            }
        }
        const fileLabel = document.createElement('label');
        fileLabel.innerText = `Or, if you have a .dft file, import that instead:`
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.dft,.gz';
        fileInput.onchange = async () => {
            const file = fileInput.files?.item(0);
            if(file == null) {
                snackbar("Couldn't load the file",'error');
                fileInput.value = '';
                return;
            }
            const data = await fileToBase64(file);
            if (data !== null) {
                console.log(data)
                sessionStorage.setItem('import', data as string); window.open("../edit/", "_self");
            }
        }
        fileLabel.append(fileInput);
        const help = document.createElement('a');
        help.innerText = 'ⓘ Help';
        help.href = '../edit/how/';
        help.style.display = 'inline-block';
        // a.style.textDecoration = 'none';
        // a.style.fontSize = '1.5em';
        help.style.width = '100%'
        help.style.textAlign = 'end';
        help.title = 'Help';
        content.append(p, input, activateImport, document.createElement('br'), fileLabel, help);
        super('Import', content);
    }
}

async function fileToBase64(file: File): Promise<string> {
    return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          resolve((reader.result as string).replace(/data:.+;base64,/,''));
        };
        reader.onerror = function (error) {
            throw error;
        };
    });
 }

const createMenuContents = document.createElement('div');
const createMenuParagraph = document.createElement('p');
createMenuParagraph.innerHTML = `
Create a new template here. <br>
Use DFOnline to sketch up and view and/or share code. <br>
`;
createMenuContents.append(createMenuParagraph);
const createMenuButton = document.createElement('button');
createMenuButton.innerText = 'Create Template';
createMenuButton.onclick = () => {
    sessionStorage.setItem('import', 'H4sIAOL1PmIA/wVAMQoAAAT8iu4ZviILI2Uwyt+vQ/RkLVTMn5Mp5WwOAAAA');
    window.open("../edit/", "_self");
}
createMenuContents.append(createMenuButton);

export const createMenu = new Menu('Create Template', createMenuContents);
