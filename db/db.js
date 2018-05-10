const config = require('config');
const _ = require('lodash');
const oracledb = require('oracledb');
const StaffFeePrivilegeSerializer = require('../serializers/staff-fee-privilege');

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

const getStaffFeePrivilegesBy = (filter, query) =>
  new Promise(async (resolve, reject) => {
    let connection;
    try {
      poolPromise.then(async (pool) => {
        connection = await pool.getConnection();
        const { rows } = await connection.execute(query, [filter]);
        _.forEach(rows, row => sanitize(row)); // Sanitize each row
        const jsonapi = StaffFeePrivilegeSerializer.serialize(rows); // Serialize data to JSON API
        resolve(jsonapi);
      }).catch(err => console.error(err));
    } catch (err) {
      reject(err);
    }
  });

module.exports = { getStaffFeePrivilegesBy, sanitize };
