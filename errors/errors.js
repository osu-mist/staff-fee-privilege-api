const JSONAPIError = require('jsonapi-serializer').Error;


// JSON API Error Object
const error = (status, title, description) => {
  return new JSONAPIError({
    status: status,
    title: title,
    detail: description
  });
};

const notFound = (description) => error(404, 'Not found', description);

module.exports = { notFound };
