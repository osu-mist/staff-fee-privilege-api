const fs = require('fs');
const yaml = require('js-yaml');

const config = yaml.safeLoad(fs.readFileSync('config.yaml'));

module.exports = config;
