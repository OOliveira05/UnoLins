import english from '../locales/en.json';
import portuguese from '../locales/pt.json';

const translations = {
  english: english,
  portuguese: portuguese,
};

export const getTranslation = (language) => {
  if (translations[language]) {
    return translations[language];
  } else {
    console.warn(`Translations for language '${language}' not found. Defaulting to English.`);
    return translations.english;
  }
};

