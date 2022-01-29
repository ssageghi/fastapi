const express = require("express");
const app = express();
const port = 3600;
const githubTrends = require("./helper/main");
var cors = require("cors");
var corsOptions = {
  origin: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  const options = {
    section: req.query.section.length > 0 ? req.query.section : "", // default: empty (repositories) - or 'developers'
    language: req.query.language, // default: empty (all) - or 'javascript', 'java' etc..
    since: req.query.since, // default: empty (daily) - or 'weekly', 'monthly'
    spoken_language_code: req.query.spoken_language_code, // default: empty (all) - or en - fs - zh ...
  };
  githubTrends(options)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
