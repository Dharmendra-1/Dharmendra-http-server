const router = require('express').Router();
const path = require('path');
const fsPromise = require('fs').promises;
const uniqueId = require('uuidv4');
const { response } = require('express');
const HTTP = require('http');

router.get('/', (request, response, next) => {
  response.status(200).send(`<h1>Welcome</h1>`);
  next();
});

router.get('/html', (request, response, next) => {
  return response
    .status(200)
    .sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/data', (request, response, next) => {
  fsPromise
    .readFile(path.join(__dirname, '../data/data.json'))
    .then((jsonData) => {
      response.setHeader('Content-Type', 'application/json');
      response.send(jsonData);
      next();
    })
    .catch((error) => {
      response
        .status(404)
        .send(`<h1>File Path Does not exists And Error is ${error}</h1>`);
      next();
    });
});

router.get('/uuid', (request, response, next) => {
  response.json({ uuid: uniqueId.uuid() });
  next();
});

router.get('/status/:statusCode', (request, response, next) => {
  const statusCodeObject = HTTP.STATUS_CODES;
  const statusCode = request.params.statusCode;
  if (statusCode in statusCodeObject) {
    response.json({ [statusCode]: statusCodeObject[statusCode] });
  }
  next();
});

router.get('/delay/:seconds', (request, response, next) => {
  const timeDelay = request.params.seconds * 1000;
  setTimeout(() => {
    response
      .status(200)
      .send(`<h1>Response after ${timeDelay / 1000} seconds </h1>`);
  }, timeDelay);
});

module.exports = router;
