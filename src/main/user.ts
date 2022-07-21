import Menu from "./menu";

const menuDiv = document.createElement('div');

export default class User {
    private static settings() : any {
        return JSON.parse(localStorage.getItem('prefrences') || '{}');
    }

    /**
     * Get a setting from the user's settings.
     * @param key The value to check
     * @param alt If the value is not found, return this
     * @returns The value stored in settings.
     */
    private static get(key : string, alt : any = undefined) : any {
        const value = User.settings()[key];
        return value === undefined ? alt : value;
    }
    private static set(key : string, value : any) : void {
        let settings = User.settings();
        settings[key] = value;
        localStorage.setItem('prefrences', JSON.stringify(settings));
    }

    /** If blocks in brackets should be shifted down. */
    public static get shiftBlocks() : boolean {
        return User.get('shiftBlocks', true);
    }
    public static set shiftBlocks(value : boolean) {
        User.set('shiftBlocks', value);
    }

    static menu : Menu = new Menu('User', menuDiv);
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

menuDiv.append(p,stackBracketsLabel);

