# Lighthouse Reports

## Creating a report

You can create a lighthouse report by calling:

`node lighthouse --url ${YOUR_URL_HERE}`

A folder will be created for the host of the site and - if applicable - a subfolder for the path. In there the report will be saved as JSON, the filename will be set to the timestamp of created report.

You can copy paste the JSON-data of the reports to [Lighthouse Report Viewer](https://googlechrome.github.io/lighthouse/viewer/) to see the dashboard.

After creating the report, the program will check for existing reports and if there are any, will compare the reports (see "Comparing reports").

## Comparing reports

When comparing reports the program will check the following audits and print out if the value hasn't changed (in grey) or the percentage it got faster (in green) or slower (in red).

- **First Contentful Paint** – makes the time at which the first text or image is painted.

- **Speed Index** – shows how quickly the contents of a page are visibly populated.

- **Time to Interactive** – is the amount of time it takes for the page to become fully interactive.

- **First Meaningful Paint** – measures when the primary content of a page is visible.

- **First CPU Idle** – marks the first time at which the page's main thread is quiet enough to handle input.

- **Max Potential First Input Delay** – The *Maximum Potential First Input Delay* that your users could experience is the duration, in milliseconds, of the longest task.

- **Time to first byte** – identifies the time at which your server sends a response.

- **Total blocking time** – Sum of all time periods between *First Contentful Paint* and *Time to Interactive*, when task length exceeded 50ms, expressed in milliseconds.

- **Estimated input latency** – is an estimate of how long your app takes to respond to user input, in milliseconds, during the busiest 5s window of page load. If your latency is higher than 50ms, users may perceive your app as laggy.

### Comparing any existing reports

To compare two existing reports you can use:

`node lighthouse --from ${PATH_TO_REPORT_1} --to ${PATH_TO_REPORT_2}`

so p.e.:

`node lighthouse --from saidragon.de/2021-04-10T00_49_08.687Z --to soliloquizin.github.io/pnp-puzzles_/2021-04-09T23_47_48.925Z`

**Notice that the filetype is not entered with the arguments!**

### Comparing the latest reports

To compare the 2 most recent reports stored for a url, you can run:

`node lighthouse --latest {$PATH_TO_REPORTS_FOLDER}`

so p.e.:

`node lighthouse --latest soliloquizin.github.io/pnp-puzzles_`
