const droparea = document.getElementById('drop')!;
const draggable = document.getElementById('drag')!;

function debug(e: DragEvent) {
    if (!e.dataTransfer) throw new Error("Error whilst managing data transfer.");
    console.log(`id: ${e.type}, target: ${(e.target as any).id}, test text: ${e.dataTransfer.getData('test')} trusted: ${e.isTrusted}`);
    console.log(e);
}

draggable.ondragstart = e => {
    if (!e.dataTransfer) throw new Error("Error whilst managing data transfer.");
    e.dataTransfer.setData('test', 'text');
    debug(e);
};
draggable.ondragend = debug;

droparea.ondrop = e => {
    debug(e);
};
droparea.ondragover = e => e.preventDefault();
droparea.ondragend = debug;
