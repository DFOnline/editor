import { Template, uploadTemplate } from "../../../edit/template";
import { snackbar, decodeTemplate, timelessTemplateLike, downloadDFT } from "../../../main/main";

const stepCount = document.querySelectorAll('div.step.v').length;
let activeStep = 1;

const prevbutton = document.querySelector<HTMLButtonElement>('button#prev')!;
const nextbutton = document.querySelector<HTMLButtonElement>('button#next')!;
prevbutton.onclick = () => stepPage(-1)
nextbutton.onclick = () => {
    if (activeStep === 3) {
        enter.click();
        return;
    }
    stepPage(1);
}

const jumplink = document.querySelector<HTMLAnchorElement>('a#jump')!;
jumplink.onclick = () => setActivePage(3);

setActivePage(1);

function stepPage(count: number) {
    setActivePage(activeStep + count);
}

function setActivePage(index: number) {
    document.querySelectorAll('div.step').forEach(e => e.classList.add('hidden'))

    nextbutton.disabled = false;
    prevbutton.disabled = false;
    const outofbounds = index <= 0;
    if (outofbounds || index === stepCount) nextbutton.disabled = true;
    if (outofbounds || index === 1) prevbutton.disabled = true;

    activeStep = index;

    const selected = document.getElementById(String(index))!;
    selected.classList.remove('hidden');
}

const link = document.querySelector<HTMLInputElement>('#link')!;
link.onclick = () => {
    navigator.clipboard.writeText(file.value);
    snackbar('Copied your link!');
}

const file = document.querySelector<HTMLButtonElement>('#file')!;


const enter = document.querySelector<HTMLAnchorElement>('a#enter')!;
enter.onclick = async e => {
    if (!timelessTemplateLike.test(input.value)) { snackbar("Looks like that data isn't valid"); e.stopPropagation(); e.preventDefault(); return; }
    const data = (input.value.match(timelessTemplateLike) || [])[0]!;
    // check it can be decompressed
    let template: Template
    try {
        template = decodeTemplate(data);
        if (!template.blocks) { snackbar("Looks like that data isn't valid."); e.stopPropagation(); e.preventDefault(); return; }
        setActivePage(0);

        let id = null;
        try {
            const upload = await uploadTemplate(data);
            id = upload.id;
        }
        finally {
            if (id == null) id = data;
            const url = `[code template](https://dfonline.dev/edit/?template=${id})`
            link.value = url;
            link.onchange = () => {
                link.value = url;
            }

            link.focus();
            setActivePage(4);

            file.onclick = () => {
                downloadDFT(data, 'template.dft');
            }

            document.querySelector('div#invalid')!.classList.add('hidden');
            document.querySelector('div#valid')!.classList.remove('hidden');
        }
    }
    catch (e) {
        console.error(e);
        snackbar("An an occurred whilst loading your data, it's likely not valid.");
    }
}



const input = document.querySelector<HTMLInputElement>('#input')!;
input.onkeyup = e => {
    if (input.onchange) input.onchange(e);
    if (e.key === 'Enter') {
        e.stopPropagation();
        enter.click();
    }
}
input.onload = input.onpaste = input.onkeydown = input.onchange = () => {
    input.classList.remove('bad');
    input.classList.remove('good');

    if (timelessTemplateLike.test(input.value)) {
        input.classList.add('good');
        return;
    }

    input.classList.add('bad');
}
document.onkeydown = e => {
    if (activeStep === 3) if (input.onkeyup) input.onkeyup(e);
}
