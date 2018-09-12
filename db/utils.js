// Sanitize raw data
const sanitize = (row) => {
  row.CAMPUS = row.CAMPUS ? row.CAMPUS.trim() : null;
  return row;
};

module.exports = { sanitize };
