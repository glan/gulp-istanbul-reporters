"use strict";

/** Outputs reports from stream of JSON coverage data
 * @param {Object} reports type : dest map
 **/
const istanbul = require('istanbul'),
    es = require('event-stream');

function istanbulReports(reports) {
    var collector = new istanbul.Collector(),
    reporters = Object.keys(reports).map(function (key) {
        return istanbul.Report.create(key, {
            dir: reports[key]
        });
    });
    return es.through(function (file) {
        var data = {};
        if (file.contents) {
            data = JSON.parse(file.contents);
        } else {
            data[file.path] = file;
        }
        collector.add(data);
    }, function end() {
        reporters.forEach(function (reporter) {
            reporter.writeReport(collector);
        });
        this.emit('end');
    });
}

module.exports = istanbulReports;
