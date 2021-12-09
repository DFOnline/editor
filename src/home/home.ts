let starts = [];
const user = localStorage.user ? JSON.parse(localStorage.user) : undefined

function importmenu(){
    var div = document.createElement('div')

    var toptext = document.createElement('p')
    toptext.innerText = `If you have your code template data, just paste it in. Press the import button, and start editing.`
    div.appendChild(toptext)

    var imports = document.createElement('div')
    var importfield = document.createElement('input')
    importfield.type = "text"
    importfield.placeholder = "Template Data";
    importfield.onkeyup = () => {(document.getElementById('activateimport') as HTMLButtonElement).click()}
    importfield.id = "importfield"
    imports.appendChild(importfield)

    var activateimport = document.createElement('button')
    activateimport.innerText = "Go!"
    activateimport.style.marginLeft = "5px"
    activateimport.id = "activateimport";
    activateimport.onclick = () => {sessionStorage.import = (document.getElementById('importfield') as HTMLInputElement).value; location.href = "/edit/"}
    imports.appendChild(activateimport)
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
}

codeutilities.onmessage = event => {
    var data = JSON.parse(event.data)
    if(data.type === "template"){
        var importField = (document.getElementById('importfield') as HTMLInputElement);
        try{
            importField.value = JSON.parse(data.received).code
        }catch{
            importmenu()
            importField.value = JSON.parse(data.received).code
        }
    }
}