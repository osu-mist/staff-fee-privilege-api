const config = require('config');
const _ = require('lodash');
const oracledb = require('oracledb');
const contrib = require('../contrib/contrib');
const { StaffFeePrivilegeSerializer } = require('../serializers/jsonapi');

process.on('SIGINT', () => process.exit());

oracledb.outFormat = oracledb.OBJECT;
const dbConfig = config.get('database');
const poolPromise = oracledb.createPool(dbConfig);

// Sanitize raw data from database
const sanitize = (row) => {
  row.CAMPUS = row.CAMPUS.trim();
  row.CURRENT_ENROLLED = row.CURRENT_ENROLLED === 'Y';
  row.CURRENT_REGISTERED = row.CURRENT_REGISTERED === 'Y';
  return row;
};

// Get connection from created pool
const getConnection = () => new Promise(async (resolve, reject) => {
  poolPromise.then(async (pool) => {
    const connection = await pool.getConnection();
    resolve(connection);
  }).catch(err => reject(err));
});

// Get StaffFeePrivileges by query
const getStaffFeePrivilegesByQuery = query =>
  new Promise(async (resolve, reject) => {
    const connection = await getConnection();
    try {
      const { rows } = await connection.execute(
        contrib.getStaffFeePrivilegesByQuery(query),
        query,
      );
      _.forEach(rows, row => sanitize(row));
      const jsonapi = StaffFeePrivilegeSerializer(rows);
      resolve(jsonapi);
    } catch (err) {
      reject(err);
    }
  });

// Get StaffFeePrivileges by ID
const getStaffFeePrivilegesById = query =>
  new Promise(async (resolve, reject) => {
    const connection = await getConnection();
    try {
      const { rows } = await connection.execute(
        contrib.getStaffFeePrivilegesByQuery(query),
        query,
      );
      if (_.isEmpty(rows)) {
        // Should return 404 if nothing found
        resolve(undefined);
      } else if (rows.length > 1) {
        // Should return 500 if get multiple results
        reject(new Error('Expect a single object but got multiple results.'));
      } else {
        const [row] = rows;
        const jsonapi = StaffFeePrivilegeSerializer(sanitize(row));
        resolve(jsonapi);
      }
    } catch (err) {
      reject(err);
    }
  });

module.exports = { getStaffFeePrivilegesByQuery, getStaffFeePrivilegesById, sanitize };
