const chai = require('chai');
const chaiString = require('chai-string');
const { sanitize } = require('../db/db');

const { assert, expect } = chai;
chai.use(chaiString);

describe('Test sanitize', () => {
  const rawRow = {
    CAMPUS: ' Oregon State - Corvallis  ',
    CURRENT_ENROLLED: 'Y',
    CURRENT_REGISTERED: 'N',
  };
  const sanitizedRow = sanitize(rawRow);

  it('should return correct format', (done) => {
    expect(sanitizedRow.CAMPUS).not.to.startsWith(' ');
    expect(sanitizedRow.CAMPUS).not.to.endsWith(' ');
    done();
  });

  it('should return correct type', (done) => {
    assert.isBoolean(sanitizedRow.CURRENT_ENROLLED);
    assert.isBoolean(sanitizedRow.CURRENT_REGISTERED);
    done();
  });
});
