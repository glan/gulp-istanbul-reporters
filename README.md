# gulp-istanbul-reports

### Example usage

```js
gulp.task('test', done => {

  let stubCov = require('gulp-istanbul-untested-coverage');
  let istanbulReports = require('gulp-istanbul-reports');
  let Server = require('karma').Server;
  let es = require('event-stream');
  let file = require('gulp-file');

  // store coverage report streams from each browser + untested code
  let coverageStreams = [];

  // run via karma
  let server = new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, () => {
    console.log("Collecting coverage data");
    // Create untested coverage report stream
    coverageStreams.push(gulp.src('./src/js/**/*.js')
      .pipe(stubCov({
        instrumenter: require('isparta').Instrumenter
      }))
    );
    es.merge.apply(null, coverageStreams)
      .pipe(istanbulReports({
        "text-summary": null,
        "lcovonly": "reports",
        "cobertura": "reports",
        "html": "reports/istanbul"
      })
    ).on('end', () => done());
  });

  // Collect coverage data from each browser run
  server.on('coverage_complete', (browser, coverageReport) => {
    coverageStreams.push(file(browser.name, JSON.stringify(coverageReport), { src: true }));
  });

  server.start();

});
```
