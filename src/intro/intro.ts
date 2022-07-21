import { version } from '../../package.json';

window.onload = async () => {
    document.getElementById('ver').innerText += " " + version;
    let animate : HTMLDivElement = document.querySelector('#animate');
    animate.classList.add('show');
    animate.onanimationend = async () => {
        animate.classList.add('expand');
        let badges : HTMLDivElement = document.querySelector('#badges');
        badges.classList.add('show')
        let text : HTMLDivElement = document.querySelector('#animate > h1');
        text.classList.add('show');
        text.onanimationend = async () => {
            await sleep(700)
            location.href = '/home/';
        }
    }
}

function sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}