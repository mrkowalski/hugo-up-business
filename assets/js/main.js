import './shared/toggler'
import * as Klaro from "klaro";

const siteLang = document.documentElement.lang.slice(0,2);

function loadGA4() {
  if (document.getElementById('ga4-src')) return;
  const s = document.createElement('script');
  s.id = 'ga4-src';
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);

  const i = document.createElement('script');
  i.id = 'ga4-init';
  i.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', ${GA_MEASUREMENT_ID});
  `;
  document.head.appendChild(i);
}

function loadHubspot() {
  if (document.getElementById('hs-forms')) return;
  // Forms embed (loads forms API)
//  const forms = document.createElement('script');
//  forms.id = 'hs-forms';
//  forms.async = true;
//  forms.defer = true;
//  forms.src = 'https://js.hsforms.net/forms/v2.js';
//  document.head.appendChild(forms);

  // (Optional) Tracking code – enable only if you want HubSpot tracking
  // const track = document.createElement('script');
  // track.async = true;
  // track.defer = true;
  // track.src = 'https://js.hs-scripts.com/{{ .Site.Params.hubspotPortalId }}.js';
  // document.head.appendChild(track);
}

const config = {
  version: 1,
  elementID: 'klaro',
  lang: siteLang,
  groupByPurpose: true,
  storageMethod: 'cookie',
  mustConsent: false,              // set true for blocking modal on first visit
  acceptAll: true,
  hideDeclineAll: true,
  default: true,                 // apps default state before user decides
  translations: {
    en: {
      consentNotice: {
        description: "This site uses 'cookie' files to monitor traffic and handle contact forms."
      },
      consentModal: {
        title: 'Privacy settings',
        description: 'This site uses cookies. Manage purposes below.',
      },
      ok: 'Accept',
      acceptSelected: 'Accept selected',
      decline: 'Decline',
      purposes: { necessary: 'Essential', analytics: 'Traffic monitoring', marketing: 'Contact forms' },
      app: {
        ga4: { title: 'Google Analytics', description: "Site's traffic monitoring." },
        hubspot: { title: 'HubSpot (contact forms)', description: 'Required to support contact forms. May set marketing cookies.' },
      },
      contextualConsent: { description: 'To show this content, enable {app} in privacy settings.' }
    },
    pl: {
      consentNotice: {
        description: "Strona wykorzystuje pliki 'cookies' do monitorowania odwiedzin i do obsługi formularzy kontaktowych."
      },
      consentModal: {
        title: 'Ustawienia prywatności',
        description: 'Strona wykorzystuje pliki cookie. Dostosuj swoje ustawienia poniżej.',
      },
      ok: 'Akceptuję',
      acceptSelected: 'Zaakceptuj wybrane',
      decline: 'Odrzuć',
      purposes: { necessary: 'Niezbędne do prawidłowego działania strony', analytics: 'Monitorowanie ruchu', marketing: 'Formularze kontaktowe' },
      app: {
        ga4: { title: 'Google Analytics', description: 'Monitorowanie odwiedzin na stronie.' },
        hubspot: { title: 'HubSpot (formularze kontaktowe)', description: "Potrzebne do poprawnego działania formularzy kontaktowych. Może zapisywać marketingowe pliki 'cookies'." },
      },
      contextualConsent: { description: 'Aby wyświetlić tę treść, włącz "{app}" w ustawieniach prywatności.' }
    }
  },
  purposes: ['necessary', 'analytics', 'marketing'],
  services: [
    {
      name: 'Google Analytics',
      purposes: ['analytics'],
      required: false,
      default: true,
      callback: (consent) => { if (consent) loadGA4(); },
      onAccept:  `gtag('consent', 'update', {'analytics_storage': 'granted'})`,
      onDecline: `gtag('consent', 'update', {'analytics_storage': 'denied'})`,
      cookies: [
        /^_ga(_.*)?/
      ],
    },
    {
      name: 'HubSpot',
      purposes: ['marketing'],
      required: false,
      default: true,
      callback: (consent) => { if (consent) loadHubspot(); }
    },
    {
      name: 'Basic',
      purposes: ['necessary'],
      required: true,
    }
  ]
};

// we assign the Klaro module to the window, so that we can access it in JS
window.klaro = Klaro;
window.klaroConfig = config;
Klaro.setup(config);
