import { book } from "./import";

const pages = document.querySelector<HTMLDivElement>('div#pages');
const input = document.querySelector<HTMLInputElement>('input#input');
input.onchange = () => {
    pages.innerHTML = '';
    book(input.value).forEach(p => {
        const page = document.createElement('p');
        page.innerText = p;
        pages.append(page);
    })
}
input.onkeyup = e => {
    if(e.key === 'Enter'){
        input.onchange(e)
    }
}