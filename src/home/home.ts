import Menu from '../main/menu';

let importMenu = new Menu('Import');
let createMenu = new Menu('Create Template');
let helpMenu = new Menu('Help');

window.onload = () => {
    Menu.setup();

    document.getElementById('import').onclick = () => importMenu.open();
    document.getElementById('create').onclick = () => createMenu.open();
    document.getElementById('help').onclick = () => helpMenu.open();
}