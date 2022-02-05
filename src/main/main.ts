import { inflate, gzip } from "pako";

let cuopen = false;

function snackbar(message : string){
    var bar = document.createElement('span')
    bar.innerText = message
    bar.onclick = event => {if(!bar.classList.contains('snackbartime')){(event.target as HTMLElement).classList.add('snackbarout')}}
    bar.onanimationend = event => (event.target as HTMLElement).remove();
    document.getElementById('snackbars').appendChild(bar);
    setTimeout(() => {if(!bar.classList.contains('snackbarout')){bar.classList.add('snackbartime')}},4000);
}

function menu(title : string, content : HTMLElement = document.createElement('span')){
    var bg = document.createElement('div');
    bg.classList.add('background');
    bg.onclick = event => {
        var hit = event.target as HTMLElement
        if(hit.classList.contains('background')){
            if(!hit.classList.contains('fade')){
                hit.classList.add('fade')
                hit.onanimationend = () => {
                    hit.remove()
                }
            }
        }
    }
    var screen = document.createElement('div');
    var obj = document.createElement('h1');
    obj.innerText = title;
    screen.appendChild(obj);
    screen.appendChild(content);
    (document.activeElement as HTMLElement).blur()
    bg.appendChild(screen);
    (document.getElementById('menus') as HTMLDivElement).appendChild(bg);
}

const user : {name: string, auth: string, token : string} = localStorage.user ? JSON.parse(localStorage.user) : undefined
function login(name : string, auth : string){
    fetch('https://WebBot.georgerng.repl.co/auth/login',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            auth
        })
    })
    .then(res => res.json())
    .then((json : {auth: string, name: string, token: string}) => {
        localStorage.user = JSON.stringify({auth,name,token:json.token});
        location.href = "./?message=Successfully logged you in!";
    })
    .catch(() => snackbar('Failed to log in.'));
}

function startup(){
    let mouseInfo : HTMLDivElement = document.querySelector('#mouseinfo');
    document.body.onmousemove = e => {
        mouseInfo.style.top = String(e.clientY + 10) + 'px';
        mouseInfo.style.left = String(e.clientX + 10) + 'px';
    }
    let urlParams = new URLSearchParams(location.search)
    var urlMessage = urlParams.get('message');
    if(urlMessage){
        snackbar(urlMessage)
    }
    return {urlParams,mouseInfo}
}

const codeutilities = new WebSocket('ws://localhost:31371/codeutilities/item');
codeutilities.onopen = () => {snackbar('Connected to CodeUtilities'); cuopen = true;}
codeutilities.onerror = () => {snackbar('Failed to connect to CodeUtilities'); cuopen = false;}

function decode(base64data : string){
    var compressData = atob(base64data);
    var uint = compressData.split('').map(function(e) {
        return e.charCodeAt(0);
    });
    var binData = new Uint8Array(uint);
    var data = inflate(binData);
    return String.fromCharCode.apply(null, new Uint16Array(data) as unknown as []);
}
function encode(codedata : string){
    var data = gzip(codedata);
    var data2 = String.fromCharCode.apply(null, new Uint16Array(data) as unknown as []);
    return btoa(data2);
}


export {codeutilities, cuopen, user, startup, login, menu, snackbar, encode, decode};