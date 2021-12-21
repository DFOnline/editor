import { startup, menu, login, cuopen, codeutilities, user } from "../main/main"

function importMenu(){
    var div = document.createElement('div')

    var toptext = document.createElement('p')
    toptext.innerText = `If you have your code template data, just paste it in. Press the import button, and start editing.`
    div.appendChild(toptext)

    var imports = document.createElement('div')
    var importField = document.createElement('input')
    importField.type = "text"
    importField.placeholder = "Template Data";
    importField.onkeyup = () => {(document.getElementById('activateimport') as HTMLButtonElement).click()}
    importField.id = "importfield"
    imports.appendChild(importField)

    var activateImport = document.createElement('button')
    activateImport.innerText = "Go!"
    activateImport.style.marginLeft = "5px"
    activateImport.id = "activateimport";
    activateImport.onclick = () => {sessionStorage.setItem('import',importField.value); location.href = `/edit/`}
    imports.appendChild(activateImport)
    div.appendChild(imports)
    if(cuopen){
        var cuad = document.createElement('p')
        cuad.innerText = "Or, because you have codeutilities you can go into minecraft, hold your template and type /sendtemplate!"
        div.appendChild(cuad)
    }
    menu('Import',div)
}

function loginMenu(){
    var div = document.createElement('div');
    if(!sessionStorage.user){
        var howTo = document.createElement('p');
        howTo.innerText = `On diamondfire, type /join 44357.
        Go to slot 9 and click it, find My DFOnline code and click it.
        In chat it should give you a link. Open it and copy the given code.
        Come back here and paste it in. You should be logged in.`
        div.appendChild(howTo)
        var codeSlot = document.createElement('input');
        codeSlot.type = 'text';
        codeSlot.placeholder = 'Code';
        codeSlot.id = "codeslot"
        codeSlot.onkeyup = event => {if(event.key == 'Enter'){(document.getElementById('login') as HTMLButtonElement).click()}}
        div.appendChild(codeSlot);
        var loginButton = document.createElement('button');
        loginButton.innerText = "Login";
        loginButton.id = "login"
        loginButton.onclick = () => login((document.getElementById('codeslot') as HTMLInputElement).value);
        div.appendChild(loginButton);
        menu("Login",div);
    }
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
            updateButton.onclick = () => login(user.auth);
            menuDiv.appendChild(updateButton);
            var logoutButton = document.createElement('button');
            logoutButton.innerText = "Logout";
            logoutButton.onclick = () => {delete(localStorage.user); location.reload();};
            menuDiv.appendChild(logoutButton);
            menu(user.name,menuDiv);
        }
    } else {
        userBox.onclick = loginMenu;
    }
    var importButton = document.getElementById('import') as HTMLButtonElement;
    importButton.onclick = importMenu;
}

codeutilities.onmessage = event => {
    var data = JSON.parse(event.data)
    if(data.type === "template"){
        var importField = (document.getElementById('importfield') as HTMLInputElement);
        try{
            importField.value = JSON.parse(data.received).code
        }catch{
            importMenu()
            importField.value = JSON.parse(data.received).code
        }
    }
}