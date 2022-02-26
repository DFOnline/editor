import { startup, menu, login, cuopen, codeutilities, user, snackbar } from "../main/main"

function importMenu(){
    var div = document.createElement('div')

    var toptext = document.createElement('p')
    toptext.innerText = `If you have your code template data, just paste it in. Press the import button, and start editing.`
    div.appendChild(toptext)

    var imports = document.createElement('div')
    var importField = document.createElement('input')
    importField.type = "text"
    importField.placeholder = "Template Data";
    importField.onkeyup = event => {if(event.key === "Enter"){activateImport.click()}}
    importField.id = "importfield"
    imports.appendChild(importField)

    var activateImport = document.createElement('button')
    activateImport.innerText = "Go!"
    activateImport.style.marginLeft = "5px"
    activateImport.onclick = () => {
        var data = importField.value.match(/H4sIA*[0-9A-Za-z+/]*={0,2}/);
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

function loginMenu(){
    var div = document.createElement('div');
    if(!sessionStorage.user){
        var howTo = document.createElement('p');
        howTo.innerHTML = `<ul><li>On diamondfire, type <span class="code">/join 44357</span>.</li>
        <li>Go to slot 9 and click it, find My DFOnline code and click it.</li>
        <li>In chat it should give you a link. Open it and copy the given code.</li>
        <li>Come back here and paste it in. You should be logged in.</li></ul>`
        div.appendChild(howTo);
        var authBox = document.createElement('div');
        authBox.style.display = 'grid';
        var nameSlot = document.createElement('input');
        nameSlot.type = 'text';
        nameSlot.placeholder = 'Username';
        nameSlot.onkeyup = event => {if(event.key === "Enter"){codeSlot.focus()}}
        authBox.appendChild(nameSlot)
        var codeSlot = document.createElement('input');
        codeSlot.type = 'text';
        codeSlot.placeholder = 'Code';
        codeSlot.onkeyup = event => {if(event.key === 'Enter'){loginButton.click()}}
        authBox.appendChild(codeSlot);
        var loginButton = document.createElement('button');
        loginButton.innerText = "Login";
        loginButton.id = "login"
        loginButton.onclick = () => login(nameSlot.value,codeSlot.value);
        authBox.appendChild(loginButton);
        div.append(authBox);
        var congrog = document.createElement('button')
        congrog.innerText = 'Get a DFOnline premuim subcription and join the democratic rebulpic of congrog!'
        congrog.onclick = () => {location.replace('https://discord.com/invite/NqU6XnyVPA')}
        div.append(congrog);
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
            updateButton.onclick = () => login(user.name,user.auth);
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
    document.querySelector('button#start').addEventListener('click',() => snackbar('Cry about it'))
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