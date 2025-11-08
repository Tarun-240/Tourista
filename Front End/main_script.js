// main_script.js
const TORISTA_DATA_SCRIPT = 'data.js';
const TORISTA_APP_SCRIPT = 'script.js';

window.toristaAppLoaded = false;

const loadToristaApp = (event) => {
    if (event) event.preventDefault(); 

    const homepageContent = document.getElementById('homepage-content');
    if (homepageContent) {
        homepageContent.style.display = 'none';
    }

    if (window.toristaAppLoaded) {
        if (window.initializeToristaApp) {
             window.initializeToristaApp();
        }
        return;
    }

    const dataScript = document.createElement('script');
    dataScript.src = TORISTA_DATA_SCRIPT;
    
    dataScript.onload = () => {
        const appScript = document.createElement('script');
        appScript.src = TORISTA_APP_SCRIPT;

        appScript.onload = () => {
            if (window.initializeToristaApp) {
                window.initializeToristaApp(); 
                window.toristaAppLoaded = true;
            } else {
                console.error("Torista App initialization function not found in script.js.");
            }
        };

        document.head.appendChild(appScript);
    };

    document.head.appendChild(dataScript);
};

document.addEventListener('DOMContentLoaded', () => {
    const buttonIds = ['load-torista-nav', 'load-torista-btn', 'load-torista-cta'];

    buttonIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', loadToristaApp);
        }
    });
});