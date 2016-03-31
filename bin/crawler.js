#!/usr/local/bin/node

var commander = require('commander');
var fs = require('fs');
var path = require('path');
var serializer = require('bs-serializer');
var packageJson = require(path.join(__dirname, '../package.json'));

commander
    .version(packageJson.version)
    .usage('<config file path>')
    .option('-t, --configFileType [' + serializer.types().join('|') + ']')
    .parse(process.argv);

if (commander.args.length < 1) {
    console.error('missing argument: <source path>');
    commander.outputHelp();
    process.exit(-1);
}

function getType(filePath) {
    var extName = path.extname(filePath);
    if (extName.length > 0 && extName.indexOf('.') == 0) {
        return extName.substr(1).toLowerCase();
    }
    return null;
}

var configPath = commander.args[0];
var configType = commander.sourceType || getType(configPath) || 'json';

var config = serializer.parse(configType, fs.readFileSync(configPath, 'utf8'));
var crawler = require(path.join(__dirname, '../lib/crawler'));

crawler(config, function(err) {});
