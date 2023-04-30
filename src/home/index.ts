import User from "../main/user";
import { codeutilities, startup } from "../main/main";
import { createMenu, ImportMenu } from "./home";

startup();
let importButton = document.getElementById('import') as HTMLButtonElement;
importButton.onclick = () => { new ImportMenu().open() };
document.querySelector('button#start')!.addEventListener('click', () => {
    createMenu.open();
})


codeutilities.onmessage = event => {
    let data = JSON.parse(event.data)
    if (data.type === "template") {
        let importField = (document.getElementById('importfield')! as HTMLInputElement);
        try {
            importField.value = JSON.parse(data.received).code
        } catch {
            new ImportMenu(JSON.parse(data.received).code).open();
        }
    }
}

const prefrences = document.querySelector<HTMLHeadingElement>('button#perf')!;
prefrences.onclick = () => {
    User.menu.open();
}
