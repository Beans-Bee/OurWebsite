// ---------- CONFIG ----------
const LANG_PATH = '/locales/';   // dossier où sont les JSON
const DEFAULT_LANG = 'en';           // langue de secours
const SUPPORTED = ['en', 'fr']; // liste des langues disponibles
// -----------------------------

// Récupérer la langue à utiliser (URL > localStorage > navigateur > défaut)
function getInitialLang() {
    // 1️⃣ URL : /fr/, /en/, …
    const urlPart = location.pathname.split('/')[1];
    if (SUPPORTED.includes(urlPart)) return urlPart;

    // 2️⃣ LocalStorage
    const stored = localStorage.getItem('lang');
    if (SUPPORTED.includes(stored)) return stored;

    // 3️⃣ Navigator (ex. "fr-FR")
    const nav = navigator.language.slice(0, 2);
    return SUPPORTED.includes(nav) ? nav : DEFAULT_LANG;
}

// Charger le fichier JSON de la langue demandée
async function loadLang(lang) {
    try {
        const resp = await fetch(`${LANG_PATH}${lang}.json`);
        if (!resp.ok) throw new Error('File not found');
        const dict = await resp.json();
        applyTranslations(dict);
        // Mémoriser le choix
        localStorage.setItem('lang', lang);
        // Mettre à jour le sélecteur
        document.getElementById('langSelect').value = lang;
        // Mettre à jour l’attribut lang du <html> (utile pour l’accessibilité)
        document.documentElement.lang = lang;
    } catch (e) {
        console.error('Impossible de charger la langue', lang, e);
    }
}

// Remplacer le texte dans le DOM
function applyTranslations(dict) {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (dict[key] !== undefined) {
            el.textContent = dict[key];
        }
    });
}

// ---------- INITIALISATION ----------
document.addEventListener('DOMContentLoaded', () => {
    const startLang = getInitialLang();
    loadLang(startLang);
});

// ---------- CHANGEMENT DE LANGUE ----------
document.getElementById('langSelect').addEventListener('change', e => {
    const newLang = e.target.value;
    loadLang(newLang);
    // Optionnel : mettre à jour l’URL sans recharger la page
    history.replaceState(null, '', `/${newLang}/`);
});