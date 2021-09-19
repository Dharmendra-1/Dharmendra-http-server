const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./router');

app.use(router);

app.use((request, response, next) => {
  response
    .status(404)
    .send('<h1>Unable to find the requested resource! 404 Not Founds</h1>');
  next();
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
