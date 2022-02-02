// https://github.com/trending/developers/javascript?since=monthly
const cheerio = require("cheerio");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = function getDevelopers(FETCH_URL) {
  return new Promise((resolve, reject) => {
    fetch(FETCH_URL)
      .then((res) => res.text())
      .then((body) => {
        const $ = cheerio.load(body);
        const box = $(".Box article.Box-row");
        let result = box.get().map((el) => {
          const author = $(el).find(".h3>a").text().trim();
          const username = $(el).find(".f4>a").text().trim();
          const avatar = $(el).find(".mx-3 img").attr("src");
          const reponame = $(el)
            .find("article .h4.lh-condensed>a")
            .text()
            .trim();
          const repoUrl = $(el)
            .find("article .h4.lh-condensed>a")
            .attr("href")
            ?.trim();
          const description = $(el).find("article .f6.mt-1").text().trim();

          const hasSponsor = {
            sponsorUrl: $(el).find("a[aria-label^=Sponsor]").attr("href")
              ? "https://github.com" +
                $(el).find("a[aria-label^=Sponsor]")?.attr("href")
              : undefined,
          };
          return {
            author,
            username,
            avatar,
            url: "https://github.com/" + username,
            reponame,
            repourl: "https://github.com" + repoUrl,
            description,
            ...hasSponsor,
          };
        });

        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
