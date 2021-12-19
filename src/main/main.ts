import { inflate, gzip } from "pako";

let cuopen = false;

function snackbar(message : string){
    var bar = document.createElement('span')
    bar.innerText = message
    bar.onclick = event => {if(!bar.classList.contains('snackbartime')){(event.target as HTMLElement).classList.add('snackbarout')}}
    bar.onanimationend = event => (event.target as HTMLElement).remove();
    (document.getElementById('snackbars') as HTMLElement).appendChild(bar);
    setTimeout(() => {if(!bar.classList.contains('snackbarout')){bar.classList.add('snackbartime')}},4000);
}

function menu(title : string,content : HTMLElement = document.createElement('span')){
    var bg = document.createElement('div');
    bg.classList.add('background');
    bg.onclick = event => {if((event.target as HTMLElement).classList.contains('background')){(event.target as HTMLElement).remove()}}
    var screen = document.createElement('div');
    var obj = document.createElement('h1');
    obj.innerText = title;
    screen.appendChild(obj);
    screen.appendChild(content);
    bg.appendChild(screen);
    (document.getElementById('menus') as HTMLDivElement).appendChild(bg);
}

function login(auth : string){
    fetch('https://WebBot.georgerng.repl.co/auth/login',{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "auth":auth
        })
    })
    .then(res => res.json())
    .then(json => {
        localStorage.user = JSON.stringify({"auth":auth,"name":json.name});
        location.href = "./?message=Successfully logged you in!";
    })
    .catch(() => snackbar('Failed to log in.'));
}

function startup(){
    let urlParams = new URLSearchParams(location.search)
    var urlMessage = urlParams.get('message');
    if(urlMessage){
        snackbar(urlMessage)
    }
}

const codeutilities = new WebSocket('ws://localhost:31371/codeutilities/item')
codeutilities.onopen = () => {snackbar('Connected to codeutilties'); cuopen = true;}
codeutilities.onerror = () => {snackbar('Failed to connect to codeutilties'); cuopen = false;}

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

export {codeutilities, cuopen, startup, login, menu, snackbar, encode, decode};