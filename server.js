const express = require('express');

const app = express();

app.get('/staff-fee-privilege', (req, res) => {
  res.send('Hello Node.js!');
});

app.listen(8080, () => {
  console.log('staff-fee-privilege API has started on port 8080');
});
