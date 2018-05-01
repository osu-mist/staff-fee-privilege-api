const config = require('config');
const _ = require('lodash');
const oracledb = require('oracledb');
const { getStaffFeePrivilegesByTerm } = require('../contrib/contrib');
const StaffFeePrivilegeSerializer = require('../serializers/staff-fee-privilege');

const dbConfig = config.get('database');
oracledb.outFormat = oracledb.OBJECT;

process.on('SIGINT', () => {
  process.exit()
});

const getStaffFeePrivileges = (term) => {
  return new Promise(async (resolve, reject) => {
    let conn;

    try {
      conn = await oracledb.getConnection(dbConfig);
      const result = await conn.execute(getStaffFeePrivilegesByTerm, [term]);
      const jsonapi = StaffFeePrivilegeSerializer.serialize(result.rows);
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
};

module.exports = { getStaffFeePrivileges };
