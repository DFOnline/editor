import { Context, load } from './contextmenu';
load()

console.log('hello world!');

window.onload = () => {
    console.log('Loaded!');
    var button = document.createElement('button');
    button.innerText = 'test!'
    button.onclick = () => {
        document.body.style.backgroundColor = '#420420';
    }
    var ctxmenu = new Context({'t':button});
    document.querySelector<HTMLButtonElement>('button#clickme').onclick = e => ctxmenu.eventOpen(e);
}