const config = require('config');
const oracledb = require('oracledb');

const { getStaffFeePrivilegesByTerm } = require('../contrib/contrib');

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
      let result = await conn.execute(getStaffFeePrivilegesByTerm, [term]);
      resolve(result.rows);
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
