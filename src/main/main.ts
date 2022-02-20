import { inflate, gzip } from "pako";

let cuopen = false;

/**
 * Shows a popup like the one saying "Couldn't connect to codeutilties"
 * @param message A message to show in the popup
 */
function snackbar(message : string){
    var bar = document.createElement('span')
    bar.innerText = message
    bar.onclick = event => {if(!bar.classList.contains('snackbartime')){(event.target as HTMLElement).classList.add('snackbarout')}}
    bar.onanimationend = event => (event.target as HTMLElement).remove();
    document.getElementById('snackbars').appendChild(bar);
    setTimeout(() => {if(!bar.classList.contains('snackbarout')){bar.classList.add('snackbartime')}},4000);
}

/**
 * Opens a menu such as the one seen as the login, import and items menu.
 * @param title The title of the menu
 * @param content HTMLElement object of what the menu should contain
 */
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
/**
 * Login to DFOnline server with Username and Password.
 * @param name Username
 * @param auth Password
 */
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

/**
 * A function which does the start up activity for all pages, and returns some data.
 * @returns MouseInfo (HTMLElement, what I use for tooltips) urlParams (self generated data for the URL)
 */
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
    const styleMap = {
        '0': {css: 'color: #000000;', reset: true},
        '1': {css: 'color: #0000aa;', reset: true},
        '2': {css: 'color: #00aa00;', reset: true},
        '3': {css: 'color: #00aaaa;', reset: true},
        '4': {css: 'color: #aa0000;', reset: true},
        '5': {css: 'color: #aa00aa;', reset: true},
        '6': {css: 'color: #ffaa00;', reset: true},
        '7': {css: 'color: #aaaaaa;', reset: true},
        '8': {css: 'color: #555555;', reset: true},
        '9': {css: 'color: #5555ff;', reset: true},
        'a': {css: 'color: #55ff55;', reset: true},
        'b': {css: 'color: #55ffff;', reset: true},
        'c': {css: 'color: #ff5555;', reset: true},
        'd': {css: 'color: #ff55ff;', reset: true},
        'e': {css: 'color: #ffff55;', reset: true},
        'f': {css: 'color: #ffffff;', reset: true},
        'l': {css: 'font-weight: bold;', reset: false},
        'n': {css: 'text-decoration: underline;', reset: false},
        'o': {css: 'font-style: italic;', reset: false},
        'm': {css: 'text-decoration: line-through;', reset: false},
        'k': {css: 'animation: fadepulse 1s infinite alternate ease-in-out;', reset: false},
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
        .filter(x => x.innerText !== '')
}

/**
 * Edits a number to look like a df one, where there usually is a .0 after things.
 * @param num The number to work this on
 * @param accuray How many digits
 * @returns A number with edits applied
 */
function dfNumber(num : number | string,accuray = 3){
    return Number(num).toPrecision(accuray).replace(/(?<=.\d)0$/,'');
}

export {codeutilities, cuopen, user, startup, login, menu, snackbar, encode, decode, minecraftColorHTML, dfNumber};