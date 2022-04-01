import { version } from '../../package.json';
// import { user } from '../main/main'; solarlint hates me for commeting cod

// var params = new URLSearchParams(window.location.search); so what I did was put some stuff here
// var code = params.get('code')
// if(code !== null){
//     fetch("https://WebBot.georgerng.repl.co/auth/discord",{
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             token: user.token
//         })
//     })
// }

window.onload = async () => {
    document.getElementById('ver').innerText += " " + version;
    var animate : HTMLDivElement = document.querySelector('#animate');
    animate.classList.add('show');
    animate.onanimationend = async () => {
        animate.classList.add('expand');
        var badges : HTMLDivElement = document.querySelector('#badges');
        badges.classList.add('show')
        var text : HTMLDivElement = document.querySelector('#animate > h1');
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