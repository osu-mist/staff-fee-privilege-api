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
    ID: '930123456',
    STUDENT_LAST_NAME: 'Underwood',
    STUDENT_MIDDLE_NAME: 'Hale',
    STUDENT_FIRST_NAME: 'Claire',
    STUDENT_LEVEL: 'Non-Degree / Credential',
    STUDENT_RATE: 'Non-Degree Graduate',
    STUDENT_CLASSIFICATION: 'Senior',
    ACADEMIC_YEAR: 'Academic Year 2017-18',
    ACADEMIC_PERIOD: 'Fall 2017',
    CAMPUS: 'Oregon State - Corvallis',
    ENROLLMENT_STATUS: 'Eligible to Register',
    CURRENT_ENROLLED: true,
    CURRENT_REGISTERED: true,
    TOTAL_CREDITS: 12,
    RECEIVABLE_ACCOUNT: 'OSU Staff Tuition',
    EMPLOYEE_LAST_NAME: 'Underwood',
    EMPLOYEE_FIRST_NAME: 'Francis',
    EMPLOYEE_INSTITUTION: 'Oregon State University',
  }];
  const jsonapi = StaffFeePrivilegeSerializer(rows);

  it('keys should be camelCase', (done) => {
    const newKeys = _.keys(jsonapi.data[0].attributes);
    _.forEach(newKeys, key => assert.equal(key, camelCase(key)));
    done();
  });
});
