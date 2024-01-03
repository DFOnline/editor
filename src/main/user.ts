import { snackbar } from "./main";
import Menu from "./menu";

const menuDiv = document.createElement('div');

export default class User {
    private static settings(): any {
        return JSON.parse(localStorage.getItem('prefrences') || '{}');
    }

    /**
     * Get a setting from the user's settings.
     * @param key The value to check
     * @param alt If the value is not found, return this
     * @returns The value stored in settings.
     */
    private static get(key: string, alt: any = undefined): any {
        const value = User.settings()[key];
        return value === undefined ? alt : value;
    }
    private static set(key: string, value: any): void {
        let settings = User.settings();
        settings[key] = value;
        localStorage.setItem('prefrences', JSON.stringify(settings));
    }

    /** If blocks in brackets should be shifted down. */
    public static get shiftBlocks(): boolean {
        return User.get('shiftBlocks', true);
    }
    public static set shiftBlocks(value: boolean) {
        User.set('shiftBlocks', value);
    }

    public static get showItems(): boolean {
        return User.get('showItems', false);
    }
    public static set showItems(value: boolean) {
        User.set('showItems', value);
    }

    static menu = new Menu('User', menuDiv);
}


const p = document.createElement('p');
p.innerText = 'Options and preference on how dfonline works.';

const stackBracketsLabel = document.createElement('label');
stackBracketsLabel.innerText = 'Stack Brackets ';
const stackBrackets = document.createElement('input');
stackBrackets.type = 'checkbox';
stackBrackets.checked = User.shiftBlocks;
stackBrackets.onchange = () => {
    User.shiftBlocks = stackBrackets.checked;
}
stackBracketsLabel.append(stackBrackets);

const showItemsLabel = document.createElement('label');
showItemsLabel.innerText = 'Show Items ';
const showItems = document.createElement('input');
showItems.type = 'checkbox';
showItems.checked = User.showItems;
showItems.onchange = () => {
    User.showItems = showItems.checked;
}
showItemsLabel.append(showItems);


const customActiondumpLabel = document.createElement('label');
customActiondumpLabel.innerText = "Custom Action Dump (don't use unless you understand) ";
const customActiondump = document.createElement('input');
customActiondump.type = 'file';
customActiondump.accept = 'application/json';
customActiondump.onchange = async () => {
    const file = await customActiondump.files?.item(0)?.text();
    if(file == null) localStorage.removeItem("actiondump");
    else {
        try {
            localStorage.setItem("actiondump",file);
            clearButton.style.display = '';
        } catch (e) {
            snackbar(`Couldn't save the actionbar:\n${e}`)
        }
    }
}
customActiondumpLabel.append(customActiondump);
const clearButton = document.createElement('button');
clearButton.innerText = 'Clear Actiondump';
clearButton.style.display = localStorage.getItem('actiondump') == null ? 'none' : '';
clearButton.onclick = () => {
    localStorage.removeItem('actiondump');
    clearButton.style.display = 'none';
}

menuDiv.append(p, stackBracketsLabel, document.createElement('br'), showItemsLabel, document.createElement('br'), customActiondumpLabel, clearButton);
