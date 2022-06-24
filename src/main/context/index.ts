import ContextMenu from "../context";

window.onload = function() {
    ContextMenu.setup();

    const funny = document.createElement('button')
    funny.innerText = 'funni'

    const xd = document.createElement('button');
    xd.innerText = 'xd'

    const thatContextMenu = new ContextMenu('Yes!',[funny,xd,subMenu.subMenu],true)
    const that = document.getElementById('that');
    that.onclick = e => thatContextMenu.toggle(e)
}

const input = document.createElement('input');
input.placeholder = 'yes';
const subMenu = new ContextMenu('uhuh',[input],true)