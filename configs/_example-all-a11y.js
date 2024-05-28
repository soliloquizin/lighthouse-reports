// see axe rules: https://dequeuniversity.com/rules/axe/4.7
// see default config: https://github.com/GoogleChrome/lighthouse/blob/8d1d78b06818ae8e7aa808353a3d9321924c74b3/core/config/default-config.js

export default {
  extends: "lighthouse:default",
  settings: {
    locale: "de-DE",
    onlyCategories: ["accessibility"],
  },
  categories: {
    accessibility: {
      auditRefs: [
        // audits that are hidden by default
        { id: "empty-heading", weight: 0, group: "a11y-navigation" },
        {
          id: "identical-links-same-purpose",
          weight: 0,
          group: "a11y-names-labels",
        },
        { id: "landmark-one-main", weight: 0, group: "a11y-best-practices" },
        {
          id: "label-content-name-mismatch",
          weight: 0,
          group: "a11y-names-labels",
        },
        { id: "table-fake-caption", weight: 0, group: "a11y-tables-lists" },
        { id: "td-has-header", weight: 0, group: "a11y-tables-lists" },
      ],
    },
  },
};
