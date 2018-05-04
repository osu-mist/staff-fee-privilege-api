const chai = require('chai');
const chaiString = require('chai-string');
const { sanitize } = require('../db/db');

const { assert, expect } = chai;
chai.use(chaiString);

describe('Test sanitize', () => {
  it('should return correct format', (done) => {
    const rawRow = {
      CAMPUS: ' Oregon State - Corvallis',
    };
    const sanitizedRow = sanitize(rawRow);

    expect(sanitizedRow.CAMPUS).not.to.startsWith(' ');
    expect(sanitizedRow.CAMPUS).not.to.endsWith(' ');
    done();
  });

  it('should return correct type', (done) => {
    const rawRow = {
      CAMPUS: '  Oregon State - Corvallis  ',
    };
    const sanitizedRow = sanitize(rawRow);

    assert.isBoolean(sanitizedRow.CURRENT_ENROLLED);
    assert.isBoolean(sanitizedRow.CURRENT_REGISTERED);
    done();
  });
});
