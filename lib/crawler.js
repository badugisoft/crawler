var async = require('async');
var path = require('path');
var fs = require('fs-extra');
var request = require('request');
var moment = require('moment');

function crowler(config, callback) {
    var now = moment();
    var options = config.options;

    async.forEachOf(config.pages, function (url, name, callback) {
        request({
            url: url,
            gzip: true,
            headers: options.requestHeaders
        }, function(err, res, data) {
            if (err) return callback(err);

            fs.outputFileSync(path.resolve(options.outputDir, name, now.format(options.outputNameFormat)), data);

            callback();
        });
    }, function(err) {
        return callback(err);
    });
}

module.exports = crowler;
