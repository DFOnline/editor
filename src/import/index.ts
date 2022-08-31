import { snackbar } from "../main/main";
import { book } from "./import";

const pages = document.querySelector<HTMLDivElement>('div#pages');
const input = document.querySelector<HTMLInputElement>('input#input');
const title = document.querySelector<HTMLHeadingElement>('h2#title');

input.onchange = () => {
    pages.innerHTML = '';
    const pagearray = book(input.value);
    title.innerText = pagearray.length + ' pages';
    pagearray.forEach((p,i) => {
        const page = document.createElement('p');
        page.innerText = p;
        page.title = 'Page ' + (i + 1)
        page.onclick = () => {
            navigator.clipboard.writeText(p);
            snackbar(`Coped page ${i + 1} to clipboard`);
            page.classList.toggle('used');
        }
        pages.append(page);
    })
}
input.onkeyup = e => {
    if(e.key === 'Enter'){
        input.onchange(e)
    }
}