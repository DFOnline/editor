import Menu from "../main/menu";
import { startup, menu, login, codeutilities, user, templateLike } from "../main/main"

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
//         cuad.innerText = "Or, because you have codeutilities you can go into minecraft, hold your template and type /sendtemplate!"
//         div.appendChild(cuad)
//     }
//     menu('Import',div)
// }

class ImportMenu extends Menu {
    constructor(code = ''){
        const content = document.createElement('div');
        const p = document.createElement('p');
        p.innerText = `If you have your code template data, just paste it in. Press the import button, and start editing.`;
        const a = document.createElement('a');
        a.innerText = 'Info';
        a.href = '/edit/how';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Template Data';
        input.onkeyup = event => {if(event.key === 'Enter'){activateImport.click()}}
        input.value = code;
        const activateImport = document.createElement('button');
        activateImport.innerText = 'Import';
        activateImport.onclick = () => {
            const data = input.value.match(templateLike);
            if(data !== null){
                sessionStorage.setItem('import',data[0]); location.href = `/edit/`;
            }
        }
        content.append(a,p,input,activateImport);
        super('Import', content);
    }
    
}

const createMenuContents = document.createElement('div');
const createMenuParagraph = document.createElement('p');
createMenuParagraph.innerHTML = `
Editing templates is not fully implemented yet. <br>
Mainly placing blocks which need them, do not place brackets. <br>
So in that means it's impossible to create working code. <br>
`;
createMenuContents.append(createMenuParagraph);
const createMenuButton = document.createElement('button');
createMenuButton.innerText = 'Create Template';
createMenuButton.onclick = () => {
    sessionStorage.setItem('import','H4sIAOL1PmIA/wVAMQoAAAT8iu4ZviILI2Uwyt+vQ/RkLVTMn5Mp5WwOAAAA');
    location.href = '/edit/';
}
createMenuContents.append(createMenuButton);

export const createMenu = new Menu('Create Template', createMenuContents);

window.onload = () => {
    startup()
    let userBox = (document.getElementById('user') as HTMLInputElement);
    if(user){
        userBox.innerHTML = user.name;
        userBox.onclick = () => {
            let menuDiv = document.createElement('div');
            let updateButton = document.createElement('button');
            updateButton.innerText = "Relog";
            updateButton.onclick = () => login(user.name,user.auth);
            menuDiv.appendChild(updateButton);
            let logoutButton = document.createElement('button');
            logoutButton.innerText = "Logout";
            logoutButton.onclick = () => {delete(localStorage.user); location.reload();};
            menuDiv.appendChild(logoutButton);
            menu(user.name,menuDiv);
        }
    } else {
        userBox.onclick = () => location.href = ('./login');
    }
    let importButton = document.getElementById('import') as HTMLButtonElement;
    importButton.onclick = () => {new ImportMenu().open()};
    document.querySelector('button#start').addEventListener('click',() => {
        createMenu.open();
    })
}

codeutilities.onmessage = event => {
    let data = JSON.parse(event.data)
    if(data.type === "template"){
        let importField = (document.getElementById('importfield') as HTMLInputElement);
        try{
            importField.value = JSON.parse(data.received).code
        }catch{
            new ImportMenu(JSON.parse(data.received).code).open();
        }
    }
}