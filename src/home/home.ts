import Menu from "../main/menu";
import { templateLike } from "../main/main"

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
        activateImport.onclick = () => {
            const data = input.value.match(templateLike);
            if (data !== null) {
                sessionStorage.setItem('import', data[0]); window.open("../edit/", "_self");
            }
        }
        const a = document.createElement('a');
        a.innerText = 'ⓘ Help';
        a.href = '../edit/how/';
        a.style.display = 'inline-block';
        // a.style.textDecoration = 'none';
        // a.style.fontSize = '1.5em';
        a.style.width = '100%'
        a.style.textAlign = 'end';
        a.title = 'Help';
        content.append(p, input, activateImport, a);
        super('Import', content);
    }

}

const createMenuContents = document.createElement('div');
const createMenuParagraph = document.createElement('p');
createMenuParagraph.innerHTML = `
Create a new template here. <br>
Use DFOnline to sketch up and view and/or share code. Coding soley using inpractical <br>
Note that editing item values cannot be done yet. <br>
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
