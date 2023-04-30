import editContext from "./editContext";
import context from "./fileContext";

export default async function menuBar() {
    const menu = document.querySelector<HTMLElement>('header#menu')!;
    menu.append(context.topMenu);
    menu.append(editContext.topMenu);
}
