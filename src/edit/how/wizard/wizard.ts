
const stepCount = document.getElementById('steps').childElementCount;
let activeStep = 1;

const prevbutton = document.querySelector<HTMLButtonElement>('button#prev');
const nextbutton = document.querySelector<HTMLButtonElement>('button#next');
prevbutton.onclick = () => stepPage(-1)
nextbutton.onclick = () => stepPage(1)

setActivePage(1);


function stepPage(count : number){
    setActivePage(activeStep + count);
}

function setActivePage(index : number){
    document.querySelectorAll('div.step').forEach(e => e.classList.add('hidden'))

    nextbutton.disabled = false;
    prevbutton.disabled = false;
    if(index === stepCount) nextbutton.disabled = true;
    if(index === 1)         prevbutton.disabled = true;

    activeStep = index;

    const selected = document.getElementById(String(index));
    selected.classList.remove('hidden')
}


const input = document.getElementById('input') as HTMLInputElement;
input.onchange = () => {
    if(input.value === ''){

    }
}