import { templateLike, snackbar, decodeTemplate } from "../../../main/main";

const stepCount = document.querySelectorAll('div.step.v').length;
let activeStep = 1;

const prevbutton = document.querySelector<HTMLButtonElement>('button#prev');
const nextbutton = document.querySelector<HTMLButtonElement>('button#next');
prevbutton.onclick = () => stepPage(-1)
nextbutton.onclick = () => {
    if(activeStep === 3){
        enter.click();
        return;
    }
    stepPage(1);
}

const jumplink = document.querySelector<HTMLAnchorElement>('a#jump');
jumplink.onclick = () => setActivePage(3);

setActivePage(1);

function stepPage(count : number){
    setActivePage(activeStep + count);
}

function setActivePage(index : number){
    document.querySelectorAll('div.step').forEach(e => e.classList.add('hidden'))

    nextbutton.disabled = false;
    prevbutton.disabled = false;
    const outofbounds = index <= 0;
    if(outofbounds || index === stepCount) nextbutton.disabled = true;
    if(outofbounds || index === 1)         prevbutton.disabled = true;
    
    activeStep = index;

    const selected = document.getElementById(String(index));
    selected.classList.remove('hidden')
}

const link = document.querySelector<HTMLInputElement>('#link');
link.onchange = () => {link.value = 'but why?'}
link.onclick = () => {
    navigator.clipboard.writeText(link.value);
    snackbar('Copied!');
}

const enter = document.querySelector<HTMLAnchorElement>('a#enter');
enter.onclick = e => {
    if(!templateLike.test(input.value)){ snackbar("Looks like that data isn't valid"); e.stopPropagation(); e.preventDefault(); return; }
    const data = input.value.match(templateLike)[0];
    // check it can be decompressed
    const template = decodeTemplate(data);
    if(!template.blocks && template.blocks.length){ snackbar("Looks like that data isn't valid"); e.stopPropagation(); e.preventDefault(); return; }
    setActivePage(0);
    fetch(`${window.sessionStorage.getItem('apiEndpoint')}save`,{'body':data,'method':'POST'}).then(f => f.json()).then(json => {
        document.querySelector('div#invalid').classList.add('hidden');
        document.querySelector('div#valid').classList.remove('hidden');
        link.value = 'https://dfonline.dev/edit/?template=' + json.id;
        // link.value = 'https://dfonline.dev/edit/?template=dfo:' + json.id;
        setActivePage(4);
        link.focus();
    });
}

const input = document.getElementById('input') as HTMLInputElement;
input.onkeyup = e => {
    input.onchange(e);
    if(e.key === 'Enter') {
        e.stopPropagation();
        enter.click();
    }
}
input.onload = input.onpaste = input.onkeydown = input.onchange = () => {
    if(input.value === '') {
        input.classList.remove('bad');
        input.classList.remove('good');
        return
    }
    if(templateLike.test(input.value)) {
        input.classList.add('good');
        return;
    }
    input.classList.add('bad');
}
document.onkeydown = e => {
    if(activeStep === 3){
        input.onkeyup(e);
    }
}