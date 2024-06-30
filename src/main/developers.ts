import { SESSION_STORE } from "./constants";
import Menu from "./menu";

export function makeDevMenu() {
    const devMenu = document.createElement('div');

    const info = document.createElement('p');
    info.innerText = `\
    Changing the API will change were the app goes for api requests.
    Enabling developer mode will add console.logs, and infomatinal overlays.
    `;
    devMenu.append(info);

    const apiEndpointLabel = document.createElement('label');
    apiEndpointLabel.innerText = 'API Endpoint: ';

    const apiEndpoint = document.createElement('input');
    apiEndpoint.type = 'text';
    apiEndpoint.value = sessionStorage.getItem(SESSION_STORE.API_ENDPOINT) ?? "";
    apiEndpoint.oninput = () => {
        sessionStorage.setItem(SESSION_STORE.API_ENDPOINT, apiEndpoint.value);
    };
    apiEndpoint.placeholder = 'api endpoint';

    apiEndpointLabel.appendChild(apiEndpoint);
    devMenu.appendChild(apiEndpointLabel);

    devMenu.append(document.createElement('br'));

    const apiVersionLabel = document.createElement('label');
    apiVersionLabel.innerText = 'API Version: ';
    const apiVersion = document.createElement('input');
    apiVersion.type = 'number';
    apiVersion.value = sessionStorage.getItem(SESSION_STORE.API_VERSION) ?? '0';
    apiVersion.min = '0';
    apiVersion.onchange = () => {
        sessionStorage.setItem(SESSION_STORE.API_VERSION, apiVersion.value)
    }
    apiVersionLabel.append(apiVersion);
    devMenu.append(apiVersionLabel);

    devMenu.append(document.createElement('br'));

    const developerModeToggleLabel = document.createElement('label');
    developerModeToggleLabel.innerText = 'Developer Mode ';
    const developerModeToggle = document.createElement('input');
    developerModeToggle.type = 'checkbox';
    developerModeToggle.checked = sessionStorage.getItem(SESSION_STORE.DEV_MODE) === 'true';
    developerModeToggle.onchange = () => {
        sessionStorage.setItem(SESSION_STORE.DEV_MODE, developerModeToggle.checked.toString());
    };
    developerModeToggleLabel.appendChild(developerModeToggle);
    devMenu.append(developerModeToggleLabel);

    /** A menu opened in any document with main via Ctrl + Shift + Alt + D */
    return new Menu('Developer Menu', devMenu);
}

/**
 * Gets if the developer mode, which can be set in the dev menu.
 * @returns {boolean} If the developer mode is enabled or not.
 */
export function isDeveloperMode(): boolean {
    return sessionStorage.getItem(SESSION_STORE.DEV_MODE) === 'true';
}

const developerOverlay = document.createElement('pre');
developerOverlay.classList.add('developerOverlay');
developerOverlay.style.display = 'none';
developerOverlay.style.position = 'fixed';
developerOverlay.style.bottom = '0px';
developerOverlay.style.right = '0px';
developerOverlay.style.width = '40%';
developerOverlay.style.height = '40%';
developerOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
developerOverlay.style.zIndex = '9999';
developerOverlay.style.color = 'white';
developerOverlay.style.fontWeight = 'bold';
developerOverlay.style.userSelect = 'none';

if (isDeveloperMode()) {
    window.addEventListener('load', () => {
        document.body.appendChild(developerOverlay);
        developerOverlay.style.display = 'block';
    }
        , { once: true });
}

export function devOverlayText(text: string, append: boolean = false): void {
    if (append) {
        if (developerOverlay.innerText.length > 0) {
            developerOverlay.innerText += '\n';
        }
        developerOverlay.innerText += text;
    }
    else developerOverlay.innerText = text;
}
