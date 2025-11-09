
// light-or-dark.js
// Version 1.0
// This script checks user appearance, language, legitimacy, and site, then loads a specific text file accordingly.

(function() {
  const forceload = true; // can be overridden externally
  const url_en_light = "https://cdn.prod.website-files.com/63ffb796365f635c485af1d8/6910ee64453b2b30a3c34a7a_en-light.txt";
  const url_en_dark = "https://cdn.prod.website-files.com/63ffb796365f635c485af1d8/6910ee64114e0e20b0995e6c_en-dark.txt";
  const url_es_light = "https://cdn.prod.website-files.com/63ffb796365f635c485af1d8/6910ee64a6b96d00ed3b3e9b_es-light.txt";
  const url_es_dark = "https://cdn.prod.website-files.com/63ffb796365f635c485af1d8/6910ee6425c665792d94b058_es-dark.txt";

  // Helper: check appearance preference
  function getAppearance() {
    try {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDark ? 'dark' : 'light';
    } catch (err) {
      console.error("Error retrieving appearance preference:", err);
      return null;
    }
  }

  // Helper: check language preference
  function getLanguage() {
    try {
      const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (lang.startsWith('en')) return 'en';
      if (lang.startsWith('es')) return 'es';
      return null;
    } catch (err) {
      console.error("Error retrieving language:", err);
      return null;
    }
  }

  // Helper: detect if user agent looks like a bot
  function isLegitUser() {
    const ua = navigator.userAgent.toLowerCase();
    const botPatterns = ["bot", "crawl", "spider", "slurp", "headless", "wget", "curl"];
    if (navigator.webdriver) return false;
    return !botPatterns.some(pattern => ua.includes(pattern));
  }

  // Helper: check site domain
  function onValidSite() {
    return window.location.hostname.includes("stthomascatholic.com");
  }

  // Main logic
  const appearance = getAppearance();
  const language = getLanguage();
  const legitUser = isLegitUser();
  const validSite = onValidSite();

  // Exit conditions
  if (!appearance || !language || !legitUser || !validSite) {
    console.warn("Exiting script due to failed checks.");
    return;
  }

  // Determine file URL
  let fileUrl = null;
  if (language === 'en' && appearance === 'light') fileUrl = url_en_light;
  else if (language === 'en' && appearance === 'dark') fileUrl = url_en_dark;
  else if (language === 'es' && appearance === 'light') fileUrl = url_es_light;
  else if (language === 'es' && appearance === 'dark') fileUrl = url_es_dark;

  if (!fileUrl) {
    console.warn("No matching file URL found.");
    return;
  }

  // Fetch and display file contents
  fetch(fileUrl, { cache: forceload ? "no-store" : "default" })
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then(text => {
      // console.log("Loaded text file content:\n", text);
      console.log(`Successfully loaded content for language: ${language}, theme: ${appearance}.`);
    })
    .catch(err => {
      console.error("Error fetching text file:", err);
    });
})();