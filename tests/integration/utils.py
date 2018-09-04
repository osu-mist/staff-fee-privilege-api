import argparse
import json
import sys
import unittest

import requests


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--config', '-i',
        help='Path to configuration file containing API credentials',
        dest='config'
    )
    parser.add_argument(
        '--debug', '-d',
        help='Enable debug logging mode',
        dest='debug',
        action='store_true'
    )
    ns, args = parser.parse_known_args(namespace=unittest)
    return ns, sys.argv[:1] + args


def load_config(input_file):
    global api_url, headers

    config = json.load(open(input_file))
    api_url = f"{config['hostname']}/{config['version']}/{config['api']}"
    payload = {
        'client_id': config['client_id'],
        'client_secret': config['client_secret'],
        'grant_type': 'client_credentials'
    }
    res = requests.post(config['token_api_url'], data=payload).json()
    headers = {'Authorization': f"Bearer {res['access_token']}"}
    config_data = {
        'api_url': api_url,
        'staff_fee_privilege_osu_id': config['staff_fee_privilege_osu_id'],
        'staff_fee_privilege_term_id': config['staff_fee_privilege_term_id']
    }
    return config_data


def get_by_params(payload):
    return requests.get(api_url, params=payload, headers=headers)


def get_by_id(id):
    url = f"{api_url}/{id}"
    return requests.get(url, headers=headers)
