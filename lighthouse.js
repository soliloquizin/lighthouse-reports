const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const argv = require("yargs").argv;
const fs = require("fs");
const glob = require("glob");
const path = require("path");

const runLighthouseInChrome = url => {
  return chromeLauncher.launch().then(chrome => {
    const opts = {
      port: chrome.port
    };
    return lighthouse(url, opts).then(results => {
      return chrome.kill().then(() => {
        return {
          js: results.lhr,
          json: results.report
        };
      });
    });
  });
};

const getContents = pathStr => {
  const output = fs.readFileSync(pathStr, "utf8", (err, results) => {
    return results;
  });
  return JSON.parse(output);
};

const calcPercentageDiff = (a, b) => {
  if (a === b) {
    return 0;
  }
  const percentage = ((b - a) / a) * 100;
  return Math.round(percentage * 100) / 100;
};

const compareReports = (from, to) => {
  const metrics = [
    "first-contentful-paint",
    "speed-index",
    "interactive",
    "first-meaningful-paint",
    "first-cpu-idle",
    "max-potential-fid",
    "time-to-first-byte",
    "total-blocking-time",
    "estimated-input-latency"
  ];

  for (let auditObj in from["audits"]) {
    if (metrics.includes(auditObj)) {
      // console.log(auditObj + ': ' + from['audits'][auditObj].numericValue + ' ' + to['audits'][auditObj].numericValue);
      const percentageDiff = calcPercentageDiff(
        from["audits"][auditObj].numericValue,
        to["audits"][auditObj].numericValue
      );

      let color = "\x1b[90m"; // grey
      const comparisonMsg = (() => {
        if (Math.sign(percentageDiff) === 1) {
          color = "\x1b[31m"; // red
          return percentageDiff + "% slower";
        } else if (Math.sign(percentageDiff) === 0) {
          return "unchanged";
        } else {
          color = "\x1b[32m"; // green
          return percentageDiff.toString().substring(1) + "% faster";
        }
      })();
      console.log(
        color,
        from["audits"][auditObj].title + " is " + comparisonMsg,
        "\x1b[37m" //reset console color to white
      );
    }
  }
};

if (argv.url) {
  const urlObj = new URL(argv.url);
  let baseDir = urlObj.host.replace("www.", "");
  let subDir;
  let targetDir = baseDir;

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }

  if (urlObj.pathname !== "/") {
    subDir = urlObj.pathname.substring(1).replace(/\//g, "_");
    targetDir += "/" + subDir;

    if (!fs.existsSync(baseDir + "/" + subDir)) {
      fs.mkdirSync(baseDir + "/" + subDir);
    }
  }

  runLighthouseInChrome(argv.url).then(results => {
    const prevReports = glob(`${targetDir}/*.json`, {
      sync: true
    });

    if (prevReports.length) {
      dates = [];
      for (report in prevReports) {
        dates.push(
          new Date(path.parse(prevReports[report]).name.replace(/_/g, ":"))
        );
      }
      let newest = dates.reduce((a, b) => {
        return Math.max(a, b);
      });
      newest = new Date(newest).toISOString();
      const recentReport = getContents(
        targetDir + "/" + newest.replace(/:/g, "_") + ".json"
      );
      compareReports(recentReport, results.js);
    }

    fs.writeFile(
      `${targetDir}/${results.js["fetchTime"].replace(/:/g, "_")}.json`,
      results.json,
      err => {
        if (err) {
          throw err;
        }
      }
    );
  });
} else if (argv.from && argv.to) {
  compareReports(
    getContents(argv.from + ".json"),
    getContents(argv.to + ".json")
  );
} else if (argv.latest) {
  const prevReports = glob(`${argv.latest}/*.json`, {
    sync: true
  });

  if (prevReports.length > 1) {
    dates = [];
    for (report in prevReports) {
      dates.push(
        new Date(path.parse(prevReports[report]).name.replace(/_/g, ":"))
      );
    }
    dates.sort().reverse();

    const firstDate = new Date(dates[0]).toISOString().replace(/:/g, "_");
    const secondDate = new Date(dates[1]).toISOString().replace(/:/g, "_");
    const firstReport = getContents(argv.latest + "/" + firstDate + ".json");
    const secondReport = getContents(argv.latest + "/" + secondDate + ".json");
    compareReports(firstReport, secondReport);
  } else {
    throw "Not enough reports to compare.";
  }
} else {
  throw "No valid arguments were passed.";
}
