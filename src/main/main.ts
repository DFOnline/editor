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

/**
 * Converts text with & or § codes into colored HTML
 * @param text The text to format.
 * @param defaultColor The default color to use (just adds it to the start, requires the & or §).
 * @param font The font to use, when unused it will just not change the font.
 * @returns An array of span elements which use css to add the formatting.
 */
function minecraftColorHTML(text : string, defaultColor = '§r',font?:string) : Array<HTMLSpanElement>{
    var styleMap = {
        '4': {css: 'color: #be0000;', reset: true},
        'c': {css: 'color: #fe3f3f;', reset: true},
        '6': {css: 'color: #d9a334;', reset: true},
        'e': {css: 'color: #fefe3f;', reset: true},
        '2': {css: 'color: #00be00;', reset: true},
        'a': {css: 'color: #3ffe3f;', reset: true},
        'b': {css: 'color: #3ffefe;', reset: true},
        '3': {css: 'color: #00bebe;', reset: true},
        '1': {css: 'color: #0000be;', reset: true},
        '9': {css: 'color: #3f3ffe;', reset: true},
        'd': {css: 'color: #fe3ffe;', reset: true},
        '5': {css: 'color: #be00be;', reset: true},
        'f': {css: 'color: #ffffff;', reset: true},
        '7': {css: 'color: #bebebe;', reset: true},
        '8': {css: 'color: #3f3f3f;', reset: true},
        '0': {css: 'color: #000000;', reset: true},
        'l': {css: 'font-weight: bold;', reset: false},
        'n': {css: 'text-decoration: underline;', reset: false},
        'o': {css: 'font-style: italic;', reset: false},
        'm': {css: 'text-decoration: line-through;', reset: false},
        'k': {css: '', reset: false},
        'r': {css: 'color: #ffffff;', reset: true},
    };
    var last = styleMap['r'].css
    return (defaultColor + text).replace(/[Âá]/g, '').match(/[&§][\dA-FK-OR].*?(?=[&§][\dA-FK-OR])|[&§][\dA-FK-OR].*/gi).map((str : string) => {
            var newStr = str.replace(/^[&§][\dA-FK-OR]/gi,'')
            var element = document.createElement('span');
            element.innerText = newStr;
            var style = styleMap[str[1] as 'r'];
            if(style.reset){last = style.css;}
            else{element.style.cssText = element.style.cssText + last; last = element.style.cssText + style.css;}
            element.style.cssText = style.css + last;
            return element;
        }
    )
}

export {codeutilities, cuopen, user, startup, login, menu, snackbar, encode, decode, minecraftColorHTML};