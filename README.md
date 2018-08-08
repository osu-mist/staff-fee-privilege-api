# Staff Fee Privilege API

Report the people who used the staff fee privilege for each term.

## Getting Started

### Prerequisites

1. Install Node.js from [nodejs.org](https://nodejs.org/en/).
2. Install [Oracle Instant Client](http://www.oracle.com/technetwork/database/database-technologies/instant-client/overview/index.html) by following [here](https://oracle.github.io/odpi/doc/installation.html).
3. Generate a self signed certificate with [OpenSSL](https://www.openssl.org/):

  ```
  $ openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
  $ openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
  ```

4. Copy [config/example.yaml](config/example.yaml) to `config/default.yaml`. Modify as necessary, being careful to avoid committing sensitive data.

    **Options for logger configuration**:

    | Option | Description |
    | ------ | ----------- |
    | **size** | Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number. |
    | **path** | The directory name to save log files to. |
    | **pattern** | A string representing the [moment.js date format](https://momentjs.com/docs/#/displaying/format/) to be used for rotating. The meta characters used in this string will dictate the frequency of the file rotation. For example, if your datePattern is simply 'HH' you will end up with 24 log files that are picked up and appended to every day. |
    | **archive** | A boolean to define whether or not to gzip archived log files. |
    | **colorize** | Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red). |
    | **jsonConsole** | A boolean to jsonfy the output. |

    **Environment variables**: Sensitive data and data that changes per environment has been moved into environment variables. Below is a list of the variables along with a definition:

    | Environment variable | Description |
    | -------------------- | ----------- |
    | **${PORT}** | The port used by the API. |
    | **${ADMIN_PORT}** | The port used by the **ADMIN** endpoint. |
    | **${USER}** | The HTTP Basic username used to authenticate API calls. |
    | **${PASSWD}** | The HTTP Basic password used to authenticate API calls. |
    | **${DBURL}** | The database URL used to connect to a backend db store. |
    | **${DBUSER}** | The database username used to connect to a backend db store. |
    | **${DBPASSWD}** | The database password used to connect to a backend db store. |
    | **${ENDPOINTURI}** | API endpoint URI. |

### Installing

```shell
# Using npm
$ npm install

# Using yarn
$ yarn
```

### Usage

1. Fetch the submodule from the contrib repository which contains SQL codes:

  ```
  $ git submodule update --init
  ```

2. Run the application:

  ```shell
  # Run linting and testing tasks before start the app
  $ gulp run

  # Run the app without running linting and testing tasks (only for development)
  $ nodemon app.js
  ```

## Running the tests

### Linting

Run [ESLint](https://eslint.org/) to check the code:

```shell
# Using npm
$ npm run lint

# Using gulp
$ gulp lint
```

_Note: We are following [Airbnb's style](https://github.com/airbnb/javascript) as the JavaScript style guide_

### Testing

Run unit tests:

```shell
# Using npm
$ npm test

# Using gulp
$ gulp test
```

## Docker

[Dockerfile](Dockerfile) is also provided. To run the app in a container, just simply install [Docker](https://www.docker.com/) first, then:

1. Download an [Oracle Instant Client 12.2 Basic Light zip (64 bits)](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html), and place in `./bin` folder.

2. Build the docker image:

  ```shell
  $ docker build -t staff-fee-privilege-api .
  ```

3. Run the app in a container:

  ```shell
  $ docker run -d \
               -p 8080:8080 \
               -p 8081:8081 \
               -v path/to/keytools/:/usr/src/staff-fee-privilege-api/keytools:ro \
               -v "$PWD"/config:/usr/src/staff-fee-privilege-api/config:ro \
               -v "$PWD"/logs:/usr/src/staff-fee-privilege-api/logs \
               --name staff-fee-privilege-api \
               staff-fee-privilege-api
  ```
