// Sanitize raw data from database
const sanitize = (row) => {
  row.CAMPUS = row.CAMPUS ? row.CAMPUS.trim() : null;
  row.CURRENT_ENROLLED = row.CURRENT_ENROLLED === 'Y';
  row.CURRENT_REGISTERED = row.CURRENT_REGISTERED === 'Y';
  return row;
};

module.exports = { sanitize };
