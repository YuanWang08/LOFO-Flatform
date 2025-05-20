export default {
  locales: [
    {
      code: "zh-tw",
      name: "繁體中文",
      file: "zh-tw.json",
      iso: "zh-TW",
    },
    {
      code: "en",
      name: "English",
      file: "en.json",
      iso: "en-US",
    },
    {
      code: "ja",
      name: "日本語",
      file: "ja.json",
      iso: "ja-JP",
    },
  ],
  lazy: true,
  langDir: "i18n/",
  defaultLocale: "zh-tw",
  strategy: "no_prefix",
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_locale",
    redirectOn: "root",
  },
};
