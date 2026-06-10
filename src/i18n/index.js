import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';
import bn from './bn.json';
import ta from './ta.json';
import te from './te.json';
import gu from './gu.json';
import kn from './kn.json';
import pa from './pa.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    bn: { translation: bn },
    ta: { translation: ta },
    te: { translation: te },
    gu: { translation: gu },
    kn: { translation: kn },
    pa: { translation: pa },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
