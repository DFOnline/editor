let menusDiv: HTMLDivElement;

/**
 * A modal like menu
 */
export default class Menu {
    title: string;
    content: HTMLElement;
    isOpen: boolean;

    private background: HTMLDivElement;
    private modal: HTMLDivElement;
    private titleElement: HTMLHeadingElement;

    constructor(title: string, content: HTMLElement = document.createElement('span')) {
        this.title = title;
        this.content = content;
        this.isOpen = false;

        this.background = document.createElement('div');
        this.background.classList.add('background');
        this.background.onclick = () => this.close();

        this.titleElement = document.createElement('h1');
        this.titleElement.innerHTML = title;

        this.modal = document.createElement('div');
        this.modal.append(this.titleElement, this.content);
        this.modal.addEventListener('click', e => e.stopPropagation());

        this.background.append(this.modal);

        return this;
    }

    /**
     * Opens the menu. Can only be done once, if you want another create a seperate instance of the object.
     */
    open() {
        if (!this.isOpen) {
            this.isOpen = true;
            menusDiv.appendChild(this.background);
        }
    }

    /**
     * Close the menu.
     * @param instant If the closing animation should be played instantly.
     */
    close(instant = false) {
        if (instant) {
            this.background.remove();
            this.isOpen = false;
        }
        else {
            if (!this.background.classList.contains('fade')) {
                this.background.classList.add('fade');
            }
            this.background.addEventListener('animationend', () => {
                this.isOpen = false;
                this.background.remove();
                this.background.classList.remove('fade');
            }, { once: true });
        }
    }

    /**
     * Makes sure the elements are in the document and variables are set up.
     */
    static setup() {
        if (document.querySelector('html body div#menus') === null) {
            menusDiv = document.createElement('div');
            menusDiv.id = 'menus';
            document.body.appendChild(menusDiv);
        }
        else {
            menusDiv = document.querySelector('html body div#menus')!;
        }
    }
}
