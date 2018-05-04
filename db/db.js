const config = require('config');
const _ = require('lodash');
const oracledb = require('oracledb');
const StaffFeePrivilegeSerializer = require('../serializers/staff-fee-privilege');

const db = config.get('database');
oracledb.outFormat = oracledb.OBJECT;

process.on('SIGINT', () => process.exit());

// Sanitize raw data from database
const sanitize = (row) => {
  row.CAMPUS = row.CAMPUS.trim();
  row.CURRENT_ENROLLED = row.CURRENT_ENROLLED === 'Y';
  row.CURRENT_REGISTERED = row.CURRENT_REGISTERED === 'Y';
  return row;
};

const getStaffFeePrivilegesBy = (filter, query) =>
  new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await oracledb.getConnection(db);
      const result = await conn.execute(query, [filter]);
      const { rows } = result;

      _.forEach(result, row => sanitize(row));

      // Serialize data to JSON API
      const jsonapi = StaffFeePrivilegeSerializer.serialize(rows);
      resolve(jsonapi);
    } catch (err) {
      reject(err);
    } finally {
      if (conn) {
        try {
          await conn.release();
        } catch (err) {
          console.error(err);
        }
      }
    }
  });

module.exports = { getStaffFeePrivilegesBy, sanitize };
