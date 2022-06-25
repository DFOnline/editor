import editContext from "./editContext";
import fileContext from "./fileContext";

export default async function menuBar(){
    const menu = document.querySelector<HTMLElement>('header#menu')
    menu.append(fileContext.topMenu);
    menu.append(editContext.topMenu);
}