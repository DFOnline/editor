import { codeutilities, encode } from "../main/main";

window.onload = () => {
    (document.getElementById('send') as HTMLButtonElement).onclick = generateTheComment;
}

function generateTheComment(){
    var code = {"blocks":[{"id":"block","block":"control","args":{"items":[]},"action":"","target":"","inverted":""}]};
    code['blocks'][0]['action'] = (document.getElementById('action') as HTMLInputElement).value
    code['blocks'][0]['target'] = (document.getElementById('target') as HTMLInputElement).value
    code['blocks'][0]['inverted'] = (document.getElementById('inverted') as HTMLInputElement).value
    codeutilities.send(
    JSON.stringify(
            {"type":"template","source":"DFOnline Comment Generator","data":
                JSON.stringify({"name":"§6Comment","data":encode(JSON.stringify(code))})
            }
        )
    );
}