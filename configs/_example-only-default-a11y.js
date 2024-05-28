// see axe rules: https://dequeuniversity.com/rules/axe/4.7
// see default config: https://github.com/GoogleChrome/lighthouse/blob/8d1d78b06818ae8e7aa808353a3d9321924c74b3/core/config/default-config.js

// all default accessibility checks (has hidden audits)
export default {
  extends: "lighthouse:default",
  settings: {
    locale: "de-DE",
    onlyCategories: [
      "accessibility" /*"performance", "seo", "best-practices"*/,
    ],
  },
};
