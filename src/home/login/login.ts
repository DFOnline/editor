import { login } from "../../main/main";

// lmao this is tiny

window.onload = () => {
    let loginButton = document.querySelector<HTMLButtonElement>('button#login');
    let nameSlot = document.querySelector<HTMLInputElement>('input#user');
    let codeSlot = document.querySelector<HTMLInputElement>('input#pass');
    loginButton.onclick = () => {
        login(nameSlot.value,codeSlot.value);
    }
}