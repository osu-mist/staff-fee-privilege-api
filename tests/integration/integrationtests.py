import logging
import sys
import unittest
from random import randint

import utils


class IntegrationTest(unittest.TestCase):
    # helper funtion: test response time
    def assert_response_time(self, res, max_elapsed_seconds):
        elapsed_seconds = res.elapsed.total_seconds()
        logging.debug(f"Request took {elapsed_seconds} second(s)")

        self.assertLess(elapsed_seconds, max_elapsed_seconds)

    # helper funtion: test object attributes
    def assert_attributes(self, attributes):
        valid_rates = [
            'Staff Undergraduate',       # STUG
            'Staff Graduate',            # STGR
            'OSU Staff Dependent UG',    # SDUG
            'OSU Staff Dependent Grad',  # SDGR
            'OUS Staff Dependent UG',    # ODUG
            'OUS Staff Dependent Grad'   # ODGR
        ]
        self.assertTrue(attributes['currentEnrolled'])
        self.assertTrue(attributes['currentRegistered'])
        self.assertIn(attributes['studentRate'], valid_rates)

    def test_bad_request(self):
        res = utils.get_by_params(None)

        self.assert_response_time(res, 1)
        self.assertEqual(res.status_code, 400)

    def test_get_by_osu_id(self):
        for _ in range(5):
            random_osu_id = f"93{randint(0000000, 9999999)}"
            with self.subTest(random_osu_id=random_osu_id):
                logging.debug(f"Tesing OSU ID: {random_osu_id}")
                res = utils.get_by_params({'osuId': random_osu_id})

                self.assertIn('data', res.json())
                data = res.json()['data']
                self.assertIsInstance(data, list)
                map(lambda x: self.assert_attributes(x['attributes']), data)
                self.assert_response_time(res, 5)
                self.assertEqual(res.status_code, 200)

    def test_get_by_invalid_osu_id(self):
        res = utils.get_by_params({'osuId': 'invalid_osu_id'})
        res_data = res.json()['data']

        self.assert_response_time(res, 1)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res_data, [])

    def test_get_by_term_id(self):
        for _ in range(3):
            random_term_id = f"{randint(2000, 2018)}0{randint(0, 3)}"
            with self.subTest(random_term_id=random_term_id):
                logging.debug(f"Tesing term: {random_term_id}")
                res = utils.get_by_params({'term': random_term_id})

                self.assertIn('data', res.json())
                data = res.json()['data']
                self.assertIsInstance(data, list)
                map(lambda x: self.assert_attributes(x['attributes']), data)
                self.assert_response_time(res, 7)
                self.assertEqual(res.status_code, 200)

    def test_get_by_invalid_term_id(self):
        res = utils.get_by_params({'term': 'invalid_term_id'})

        self.assertIn('data', res.json())
        self.assertEqual(res.json()['data'], [])
        self.assert_response_time(res, 1)
        self.assertEqual(res.status_code, 200)

    def test_get_by_valid_id(self):
        id = f"{osu_id}-{term_id}"
        res = utils.get_by_id(id)

        self.assertIn('data', res.json())
        self.assertIsInstance(res.json()['data'], dict)
        self.assert_response_time(res, 5)
        self.assertEqual(res.status_code, 200)
        self.assert_attributes(res.json()['data']['attributes'])

    def test_get_by_invalid_id(self):
        id = 'invalid_id'
        res = utils.get_by_id(id)

        self.assert_response_time(res, 1)
        self.assertEqual(res.status_code, 404)


if __name__ == '__main__':
    args, argv = utils.parse_args()
    config_data = utils.load_config(args.config)
    logging.basicConfig(level=logging.DEBUG if args.debug else logging.WARNING)

    osu_id = config_data['staff_fee_privilege_osu_id']
    term_id = config_data['staff_fee_privilege_term_id']

    sys.argv[:] = argv
    unittest.main()
