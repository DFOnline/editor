import { templateLike } from '../../main/main';
import Menu from '../../main/menu';

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

const importMenu = new Menu('Import', document.getElementById('import-menu'));
const createMenu = new Menu('Create Template', createMenuContents);
const helpMenu = new Menu('Help', document.getElementById('help-content'));

window.onload = () => {
    Menu.setup();

    document.getElementById('import').onclick = () => {
        importMenu.open();
        document.getElementById('import-button').onclick = () => {
            const importText = document.querySelector<HTMLButtonElement>('input#import-text').value;
            const importData = importText.match(templateLike);
            if(importData !== null){
                sessionStorage.setItem('import', importData[0]);
                location.href = '/edit';
            }
        };
    }
    document.getElementById('create').onclick = () => createMenu.open();
    document.getElementById('help').onclick = () => helpMenu.open();
}

export { createMenu };
