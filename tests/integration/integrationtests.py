import logging
import sys
import unittest
from random import randint

import utils


class IntegrationTest(unittest.TestCase):
    # helper funtion: test response time
    def assert_response_time(self, elapsed_seconds, max_elapsed_seconds):
        logging.debug(f"Request took {elapsed_seconds} second(s)")
        self.assertLess(elapsed_seconds, max_elapsed_seconds)

    def test_get_by_osu_id(self):
        for _ in range(5):
            random_osu_id = f"93{randint(0000000, 9999999)}"
            with self.subTest(random_osu_id=random_osu_id):
                res = utils.get_by_osu_id(random_osu_id)
                res_data = res.json()['data']

                self.assert_response_time(res.elapsed.total_seconds(), 1)
                self.assertEqual(res.status_code, 200)
                self.assertIsInstance(res_data, list)

    def test_get_by_term_id(self):
        for _ in range(3):
            random_term_id = f"{randint(2000, 2018)}0{randint(0, 3)}"
            with self.subTest(random_term_id=random_term_id):
                res = utils.get_by_term_id(random_term_id)
                res_data = res.json()['data']

                self.assert_response_time(res.elapsed.total_seconds(), 20)
                self.assertEqual(res.status_code, 200)
                self.assertIsInstance(res_data, list)


if __name__ == '__main__':
    args, argv = utils.parse_args()
    config_data = utils.load_config(args.inputfile)

    osu_id = config_data['staff_fee_privilege_osu_id']
    term_id = config_data['staff_fee_privilege_term_id']

    sys.argv[:] = argv
    unittest.main()
