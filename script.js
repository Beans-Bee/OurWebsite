// Website internationalization script

import i18next from 'i18next';
import Backend from 'i18next-http-backend';

const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang') || navigator.language.split('-')[0] || 'en';

i18next
  .use(Backend)
  .init({
    lng: lang,
    fallbackLng: 'en',
    backend: { loadPath: '/locales/{{lng}}.json' },
  })
  .then(() => {
    document.querySelector('#welcome').textContent = i18next.t('welcome_message');
    document.querySelector('#nav-home').textContent = i18next.t('nav.home');
    document.querySelector('#nav-projects').textContent = i18next.t('nav.projects');
    document.querySelector('#nav-about').textContent = i18next.t('nav.about');
  });