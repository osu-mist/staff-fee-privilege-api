const decamelize = require('decamelize');
const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const swagger = yaml.safeLoad(fs.readFileSync('./swagger.yaml', 'utf8'));

const StaffFeePrivilegeSerializer = (rows, endpointUri) => {
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
      self: row => `${endpointUri}/staff-fee-privilege/${row.ID}`,
    },
  }).serialize(rows);
};

module.exports = { StaffFeePrivilegeSerializer };
