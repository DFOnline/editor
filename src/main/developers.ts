import Menu from "./menu";

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
apiEndpoint.value = sessionStorage.getItem('apiEndpoint');
apiEndpoint.oninput = () => {
    sessionStorage.setItem('apiEndpoint',apiEndpoint.value);
};
apiEndpoint.placeholder = 'api endpoint';

apiEndpointLabel.appendChild(apiEndpoint);
devMenu.appendChild(apiEndpointLabel);

devMenu.append(document.createElement('br'));

const developerModeToggleLabel = document.createElement('label');
developerModeToggleLabel.innerText = 'Developer Mode ';
const developerModeToggle = document.createElement('input');
developerModeToggle.type = 'checkbox';
developerModeToggle.checked = sessionStorage.getItem('developerMode') === 'true';
developerModeToggle.onchange = () => {
    sessionStorage.setItem('developerMode',developerModeToggle.checked.toString());
};
developerModeToggleLabel.appendChild(developerModeToggle);
devMenu.append(developerModeToggleLabel);

/** A menu opened in any document with main via Ctrl + Shift + Alt + D */
export const developerMenu = new Menu('Developer Menu',devMenu);

/**
 * Gets if the developer mode, which can be set in the dev menu.
 * @returns {boolean} If the developer mode is enabled or not.
 */
export function isDeveloperMode() : boolean{
    return sessionStorage.getItem('developerMode') === 'true';
}