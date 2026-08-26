(() => {
  const supportedLanguages = ["zh-Hans", "zh-Hant", "en"];
  const fallbackLanguage = "zh-Hans";
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  const language = supportedLanguages.includes(requestedLanguage) ? requestedLanguage : fallbackLanguage;
  const copy = {
    "zh-Hans": { navigation: "页面导航", home: "首页", support: "支持", privacy: "隐私政策" },
    "zh-Hant": { navigation: "頁面導覽", home: "首頁", support: "支援", privacy: "隱私權政策" },
    en: { navigation: "Page navigation", home: "Home", support: "Support", privacy: "Privacy Policy" }
  };

  document.documentElement.lang = language === "zh-Hans" ? "zh-CN" : language === "zh-Hant" ? "zh-Hant" : "en";
  document.querySelectorAll("[data-language]").forEach((element) => {
    element.hidden = element.dataset.language !== language;
  });
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = copy[language][element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", copy[language][element.dataset.i18nAriaLabel]);
  });
  document.querySelectorAll("[data-title]").forEach((element) => {
    document.title = element.dataset.title.split("|")[supportedLanguages.indexOf(language)] || element.dataset.title;
  });
  document.querySelectorAll("[data-language-link]").forEach((element) => {
    const url = new URL(element.href, window.location.href);
    url.searchParams.set("lang", element.dataset.languageLink);
    element.href = url.toString();
    element.setAttribute("aria-current", element.dataset.languageLink === language ? "true" : "false");
  });
  document.querySelectorAll("a[data-preserve-language]").forEach((element) => {
    const url = new URL(element.href, window.location.href);
    url.searchParams.set("lang", language);
    element.href = url.toString();
  });

  const localizedContent = window.QieTingTranslations?.[language] || {};
  document.querySelectorAll("main :is(.eyebrow, h1, h2, h3, p, li, .note)").forEach((element) => {
    const source = element.textContent.trim();
    if (!element.querySelector("a") && localizedContent[source]) {
      element.textContent = localizedContent[source];
    }
  });
  const feedbackPrivacy = {
    "zh-Hans": ["反馈只会在你确认提交后发送；你可以选择是否附加诊断信息。详细处理方式请见", "隐私政策", "。"],
    "zh-Hant": ["回饋只會在你確認提交後傳送；你可選擇是否附加診斷資訊。詳細處理方式請見", "隱私權政策", "。"],
    en: ["Feedback is sent only after you confirm submission. You may choose whether to attach diagnostic information. For details, see the ", "Privacy Policy", "."]
  };
  document.querySelectorAll(".feedback-privacy").forEach((element) => {
    const [before, label, after] = feedbackPrivacy[language];
    element.replaceChildren(before, Object.assign(document.createElement("a"), {
      href: `https://sapphirezzz.github.io/qieting-support/privacy/?lang=${language}`,
      textContent: label
    }), after);
  });
  const page = window.location.pathname.includes("/privacy/") ? "privacy" : window.location.pathname.includes("/support/") ? "support" : "home";
  const titles = {
    support: { "zh-Hans": "支持｜且停", "zh-Hant": "支援｜且停", en: "Support — QieTing" },
    home: { "zh-Hans": "且停", "zh-Hant": "且停", en: "QieTing" },
    privacy: { "zh-Hans": "隐私政策｜且停", "zh-Hant": "隱私權政策｜且停", en: "Privacy Policy — QieTing" }
  };
  document.title = titles[page][language];
})();
