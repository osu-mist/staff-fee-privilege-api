const config = require('config');
const _ = require('lodash');
const oracledb = require('oracledb');
const contrib = require('../contrib/contrib');
const { StaffFeePrivilegeSerializer } = require('../serializers/jsonapi');

const dbConfig = config.get('database');
oracledb.outFormat = oracledb.OBJECT;

process.on('SIGINT', () => process.exit());
const poolPromise = oracledb.createPool(dbConfig);

// Sanitize raw data from database
const sanitize = (row) => {
  row.CAMPUS = row.CAMPUS.trim();
  row.CURRENT_ENROLLED = row.CURRENT_ENROLLED === 'Y';
  row.CURRENT_REGISTERED = row.CURRENT_REGISTERED === 'Y';
  return row;
};

// Generic getter function
const getStaffFeePrivilegesByQuery = query =>
  new Promise(async (resolve, reject) => {
    let connection;
    try {
      poolPromise.then(async (pool) => {
        connection = await pool.getConnection();
        const { rows } = await connection.execute(
          contrib.getStaffFeePrivilegesByQuery(query),
          query,
        );
        _.forEach(rows, row => sanitize(row)); // Sanitize each row
        const jsonapi = StaffFeePrivilegeSerializer(rows); // Serialize data to JSON API
        resolve(jsonapi);
      }).catch(err => console.error(err));
    } catch (err) {
      reject(err);
    }
  });

module.exports = { getStaffFeePrivilegesByQuery, sanitize };
