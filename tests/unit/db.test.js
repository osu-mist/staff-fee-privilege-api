const reqlib = require('app-root-path').require;
const chai = require('chai');
const chaiString = require('chai-string');

const { sanitize } = reqlib('/db/utils');

const { expect } = chai;
chai.use(chaiString);

describe('Test sanitize', () => {
  const rawRow = {
    CAMPUS: ' Oregon State - Corvallis  ',
  };
  const sanitizedRow = sanitize(rawRow);

  it('should not have trailing/leading white spaces', (done) => {
    expect(sanitizedRow.CAMPUS).not.to.startsWith(' ');
    expect(sanitizedRow.CAMPUS).not.to.endsWith(' ');
    done();
  });
});
