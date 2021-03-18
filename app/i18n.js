/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 *   IMPORTANT: This file is used by the internal build
 *   script `extract-intl`, and must use CommonJS module syntax
 *   You CANNOT use import/export in this file.
 */
//const addLocaleData = require('react-intl').addLocaleData; //eslint-disable-line
//const enLocaleData = require('react-intl/locale-data/en');
//const deLocaleData = require('react-intl/locale-data/de');

//addLocaleData(enLocaleData);
//addLocaleData(deLocaleData);

const enTranslationMessages = require('./translations/en.json');
const deTranslationMessages = require('./translations/de.json');

const enLocaleData = require('@formatjs/intl-relativetimeformat/locale-data/en');
const deLocaleData = require('@formatjs/intl-relativetimeformat/locale-data/de');

if (!Intl.PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill');
  require('@formatjs/intl-pluralrules/locale-data/en'); // Add locale data for de
  require('@formatjs/intl-pluralrules/locale-data/de'); // Add locale data for de
}

if (!Intl.RelativeTimeFormat) {
  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/locale-data/en'); // Add locale data for de
  require('@formatjs/intl-relativetimeformat/locale-data/de'); // Add locale data for de
}

const DEFAULT_LOCALE = 'en';

// prettier-ignore
const appLocales = [
  'en',
  'de',
];

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
      : {};
  const flattenFormattedMessages = (formattedMessages, key) => {
    const formattedMessage =
      !messages[key] && locale !== DEFAULT_LOCALE
        ? defaultFormattedMessages[key]
        : messages[key];
    return Object.assign(formattedMessages, { [key]: formattedMessage });
  };
  return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  de: formatTranslationMessages('de', deTranslationMessages),
};

exports.appLocales = appLocales;
exports.formatTranslationMessages = formatTranslationMessages;
exports.translationMessages = translationMessages;
exports.DEFAULT_LOCALE = DEFAULT_LOCALE;
