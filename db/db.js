const config = require('config');
const oracledb = require('oracledb');
const StaffFeePrivilegeSerializer = require('../serializers/staff-fee-privilege');

const dbConfig = config.get('database');
oracledb.outFormat = oracledb.OBJECT;

process.on('SIGINT', () => {
  process.exit()
});

const getStaffFeePrivilegesBy = (filter, query) => {
  return new Promise(async (resolve, reject) => {
    let conn;

    try {
      conn = await oracledb.getConnection(dbConfig);
      const result = await conn.execute(query, [filter]);
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

module.exports = { getStaffFeePrivilegesBy };
