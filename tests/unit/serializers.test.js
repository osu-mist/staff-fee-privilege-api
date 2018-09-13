const reqlib = require('app-root-path').require;
const camelCase = require('camelcase');
const chai = require('chai');
const chaiString = require('chai-string');
const _ = require('lodash');

const { StaffFeePrivilegeSerializer } = reqlib('/serializers/jsonapi');

const { assert } = chai;
chai.use(chaiString);

describe('Test staff-fee-privillege serializer', () => {
  const rows = [{
    ID: '930123456-201801',
    STUDENT_OSU_ID: '930123456',
    TERM: '201801',
    STUDENT_LAST_NAME: 'Underwood',
    STUDENT_MIDDLE_NAME: 'Hale',
    STUDENT_FIRST_NAME: 'Claire',
    STUDENT_LEVEL: 'Non-Degree / Credential',
    STUDENT_RATE: 'Non-Degree Graduate',
    STUDENT_CLASSIFICATION: 'Senior',
    CAMPUS: 'Oregon State - Corvallis',
    EMPLOYEE_OSU_ID: '936543210',
    EMPLOYEE_LAST_NAME: 'Underwood',
    EMPLOYEE_FIRST_NAME: 'Francis',
    EMPLOYEE_INSTITUTION: 'Oregon State University',
    RECEIVABLE_ACCOUNT: 'OSU Staff Tuition',
  }];
  const jsonapi = StaffFeePrivilegeSerializer(rows, 'exampleUri');

  it('keys should be camelCase', (done) => {
    const newKeys = _.keys(jsonapi.data[0].attributes);
    _.forEach(newKeys, key => assert.equal(key, camelCase(key)));
    done();
  });
});
