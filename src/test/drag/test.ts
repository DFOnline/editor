const droparea = document.getElementById('drop');
const draggable = document.getElementById('drag');

function debug(DragEvent : DragEvent){
    console.log(`id: ${DragEvent.type}, target: ${(DragEvent.target as any).id}, test text: ${DragEvent.dataTransfer.getData('test')} trusted: ${DragEvent.isTrusted}`);
    console.log(DragEvent);
}

draggable.ondragstart = e => {
    e.dataTransfer.setData('test','text')
    debug(e);
};
draggable.ondragend = debug;

droparea.ondrop = e => {
    debug(e);
};
droparea.ondragover = e => e.preventDefault();
droparea.ondragend = debug;