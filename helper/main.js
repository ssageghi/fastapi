const getRepos = require("./getRepos");
const getDevelopers = require("./getDevelopers");
const cheerio = require("cheerio");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function getUrl(section, language, since, spoken_language_code) {
  const BASE_URL = "https://github.com/trending";

  let FETCH_URL = section ? BASE_URL + "/developers" : BASE_URL;

  FETCH_URL =
    (language ? FETCH_URL + "/" + language : FETCH_URL) + "?since=" + since;

  FETCH_URL = spoken_language_code
    ? FETCH_URL + "&spoken_language_code=" + spoken_language_code
    : FETCH_URL;

  return FETCH_URL;
}

function githubTrends({
  section,
  language,
  since = "daily",
  spoken_language_code,
} = {}) {
  const FETCH_URL = getUrl(section, language, since, spoken_language_code);

  return section ? getDevelopers(FETCH_URL) : getRepos(FETCH_URL);
}
function getLanguages(FETCH_URL) {
  return new Promise((resolve, reject) => {
    fetch(FETCH_URL)
      .then((res) => res.text())
      .then((body) => {
        const $ = cheerio.load(body);
        const spokenLanguages = $(
          "#select-menu-spoken-language .select-menu-item-text"
        );
        let result = spokenLanguages.get().map((el) => {
          const spokenLanguage = $(el).text().trim();

          return spokenLanguage;
        });

        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function getOptions(FETCH_URL) {
  return new Promise((resolve, reject) => {
    fetch(FETCH_URL)
      .then((res) => res.text())
      .then((body) => {
        const $ = cheerio.load(body);
        const languages = $("#select-menu-language .select-menu-item-text");
        const spokenLanguages = $(
          "#select-menu-spoken-language .select-menu-item-text"
        );
        let options = {};
        options.languages = ["Any"];
        options.spoken_languages = ["Any"];

        languages
          .get()
          .map((el) => options.languages.push($(el).text().trim()));
        spokenLanguages
          .get()
          .map((el) => options.spoken_languages.push($(el).text().trim()));
        resolve(options);
      })
      .catch((e) => {
        reject(e);
      });
  });
}

module.exports = {
  githubTrends,
  getOptions,
};

// https://github.com/trending/developers/javascript?since=monthly
