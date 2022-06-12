import { startup, menu, login, codeutilities, user, templateLike } from "../main/main"

function importMenu(code = ""){
    var div = document.createElement('div');

    var toptext = document.createElement('p');
    toptext.innerText = `If you have your code template data, just paste it in. Press the import button, and start editing.`;
    div.appendChild(toptext);

    var imports = document.createElement('div');
    var importField = document.createElement('input');
    importField.type = "text";
    importField.placeholder = "Template Data";
    importField.onkeyup = event => {if(event.key === "Enter"){activateImport.click()}}
    importField.id = "importfield";
    importField.value = code;
    imports.appendChild(importField);

    var activateImport = document.createElement('button')
    activateImport.innerText = "Go!"
    activateImport.style.marginLeft = "5px"
    activateImport.onclick = () => {
        var data = importField.value.match(templateLike);
        if(data !== null){
            sessionStorage.setItem('import',data[0]); location.href = `/edit/`;
        }
    }
    imports.appendChild(activateImport)
    div.appendChild(imports)
    if(cuopen){
        var cuad = document.createElement('p')
        cuad.innerText = "Or, because you have codeutilities you can go into minecraft, hold your template and type /sendtemplate!"
        div.appendChild(cuad)
    }
    menu('Import',div)
}

window.onload = () => {
    startup()
    var userBox = (document.getElementById('user') as HTMLInputElement);
    if(user){
        userBox.innerHTML = user.name;
        userBox.onclick = () => {
            var menuDiv = document.createElement('div');
            var updateButton = document.createElement('button');
            updateButton.innerText = "Relog";
            updateButton.onclick = () => login(user.name,user.auth);
            menuDiv.appendChild(updateButton);
            var logoutButton = document.createElement('button');
            logoutButton.innerText = "Logout";
            logoutButton.onclick = () => {delete(localStorage.user); location.reload();};
            menuDiv.appendChild(logoutButton);
            menu(user.name,menuDiv);
        }
    } else {
        userBox.onclick = () => location.href = ('./login');
    }
    var importButton = document.getElementById('import') as HTMLButtonElement;
    importButton.onclick = () => {importMenu()};
    document.querySelector('button#start').addEventListener('click',() => {
        var create = document.createElement('div');
        var p = document.createElement('p');
        p.innerHTML = `
Creating new templates is rather useless, knowing that the editor can't do everything.<br>
I suggest using DFOnline as a template viewer (knowing that derpystuff template web view is broken).<br>
I don't suggest as using it as a full on editor, since it isn't finished and DF serves as better editing for code itself.<br>
Sorry for the massive block of text, but have a button to make it an empty template, if you really want to.
`;
        create.appendChild(p);
        var createButton = document.createElement('button');
        createButton.innerText = "Create Empty Template";
        createButton.onclick = () => {
            // set importdata to empty template
            sessionStorage.setItem('import','H4sIAOL1PmIA/wVAMQoAAAT8iu4ZviILI2Uwyt+vQ/RkLVTMn5Mp5WwOAAAA');
            location.href = '/edit/';
        }
        create.appendChild(createButton);
        menu('Create',create);
    })
}

codeutilities.onmessage = event => {
    var data = JSON.parse(event.data)
    if(data.type === "template"){
        var importField = (document.getElementById('importfield') as HTMLInputElement);
        try{
            importField.value = JSON.parse(data.received).code
        }catch{
            importMenu(JSON.parse(data.received).code)
        }
    }
}