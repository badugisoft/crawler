var async = require('async');
var path = require('path');
var fs = require('fs-extra');
var request = require('request');
var moment = require('moment');
var Iconv = require('iconv').Iconv;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function crowler(config, callback) {
    var now = moment();
    var options = config.options;

    async.forEachOf(config.pages, function (url, name, callback) {
        request({
            url: url,
            gzip: true,
            encoding: null,
            headers: options.requestHeaders
        }, function(err, res, data) {
            if (err) return callback(err);

            var m = /charset=(.+)/i.exec(res.headers['content-type']);
            if (m) {
                var encoding = m[1].toLowerCase().replace('-', '');
                if (encoding !== 'utf8') {
                    var toUtf8 = new Iconv(m[1], 'UTF-8//TRANSLIT//IGNORE');
                    data = toUtf8.convert(new Buffer(data)).toString('UTF-8');
                }
                else {
                    data = data.toString('utf8');
                }
            }
            else {
                data = data.toString('utf8');
            }

            fs.outputFileSync(path.resolve(options.outputDir, name, now.format(options.outputNameFormat)), data);

            callback();
        });
    }, function(err) {
        return callback(err);
    });
}

module.exports = crowler;
