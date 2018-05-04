# Staff Fee Privilege API

Report the people who used the staff fee privilege for each term.


## Prerequisites

1. Install Node.js from [nodejs.org](https://nodejs.org/en/).
2. Install [Oracle Instant Client](http://www.oracle.com/technetwork/database/database-technologies/instant-client/overview/index.html) by following [here](https://oracle.github.io/odpi/doc/installation.html).
3. Generate a self signed certificate with [OpenSSL](https://www.openssl.org/):

  ```
  $ openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
  $ openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
  ```

4. Copy [config/example.yaml](config/example.yaml) to `config/default.yaml`. Modify as necessary, being careful to avoid committing sensitive data.

## Installation

```shell
# Using npm
$ npm install

# Using yarn
$ yarn
```

## Usage

1. Fetch the submodule from the contrib repository which contains SQL codes:

  ```
  $ git submodule update --init
  ```

2. Run the application:

  ```
  $ npm start
  ```

## Test

* Run unit tests:

  ```
  $ npm test
  ```

* Run [ESLint](https://eslint.org/) to check the code:

  ```
  $ npm run lint
  ```

  _Note: We are not following [Airbnb's style](https://github.com/airbnb/javascript) as the JavaScript style guide_
