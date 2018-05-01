const config = require('config');
const oracledb = require('oracledb');
const { getStaffFeePrivilegesByTerm, getStaffFeePrivilegesById } = require('../contrib/contrib');
const StaffFeePrivilegeSerializer = require('../serializers/staff-fee-privilege');

const dbConfig = config.get('database');
oracledb.outFormat = oracledb.OBJECT;

process.on('SIGINT', () => {
  process.exit()
});

const getByTerm = (term) => {
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

const getById = (id) => {
  return new Promise(async (resolve, reject) => {
    let conn;

    try {
      conn = await oracledb.getConnection(dbConfig);
      const result = await conn.execute(getStaffFeePrivilegesById, [id]);
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

module.exports = { getByTerm, getById };
