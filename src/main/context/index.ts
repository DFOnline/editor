import ContextMenu from "../context";

window.onload = function() {
    ContextMenu.setup();
    const that = document.getElementById('that');
    that.append(thatContextMenu.topMenu)
}

const input = document.createElement('input');
input.placeholder = 'yes';
input.onkeydown = e => {if(e.key === 'Enter'){thatContextMenu.close(); subMenu.close()}}
const subMenu = new ContextMenu('uhuh',[input],true)

const funny = document.createElement('button')
funny.innerText = 'funni'
funny.onclick = () => {thatContextMenu.close()};

const xd = document.createElement('button');
xd.innerText = 'xd'
xd.onclick = () => {thatContextMenu.close()};

const thatContextMenu = new ContextMenu('Yes!',[funny,xd,subMenu.subMenu],true)