require('dotenv').config();
const config = require('config');
const decamelize = require('decamelize');
const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const apiConfig = config.get('api');
const swagger = yaml.safeLoad(fs.readFileSync('./swagger.yaml', 'utf8'));

const StaffFeePrivilegeSerializer = (rows) => {
  const rourceObject = swagger.definitions.StaffFeePrivilegeRourceObject;
  const type = rourceObject.properties.type.example;
  const keys = _.keys(rourceObject.properties.attributes.properties);

  // Adjust attribute keys to match oracledb column names
  _.forEach(keys, (key, index) => {
    keys[index] = decamelize(key).toUpperCase();
  });

  return new JSONAPISerializer(type, {
    attributes: keys,
    id: 'ID',
    keyForAttribute: 'camelCase',
    dataLinks: {
      self: row => `${process.env.ENDPOINTURI || apiConfig.endpointUri}/${apiConfig.name}/${row.ID}`,
    },
  }).serialize(rows);
};

module.exports = { StaffFeePrivilegeSerializer };
