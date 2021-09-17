const http = require('http');
const fs = require('fs');
const uniqueId = require('uuidv4');
const path = require('path');
const PORT = process.env.PORT || 3000;

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf-8', (error, data) => {
      if (error) {
        reject('Filename is not correct..');
      } else {
        resolve(data);
      }
    });
  });
};

const server = http.createServer((request, response) => {
  const url = request.url.split('/');
  const URL = url[1];

  switch (URL) {
    case 'html':
      readFile(path.join(__dirname, '../public/index.html'))
        .then((content) => {
          response.writeHead(200, { 'content-type': 'text/html' });
          response.write(content);
          response.end();
        })
        .catch((error) => {
          response.writeHead(404, { 'content-type': 'text/html' });
          response.write('File Not Found and Error :' + error);
          response.end();
        });
      break;
    case 'data':
      readFile(path.join(__dirname, '../data/data.json'))
        .then((content) => {
          response.writeHead(200, { 'content-type': 'application/json' });
          response.write(content);
          response.end();
        })
        .catch((error) => {
          response.writeHead(404, { 'content-type': 'application/json' });
          response.write('File Not Found and Error :' + error);
          response.end();
        });
      break;
    case 'uuid':
      const idObj = { uuid: uniqueId.uuid() };
      response.writeHead(200, { 'content-type': 'application/json' });
      response.write(JSON.stringify(idObj));
      response.end();
      break;
    case 'status':
      const statusCodeObject = http.STATUS_CODES;
      const requestedSatusCode = path.basename(request.url);

      if (
        requestedSatusCode in statusCodeObject &&
        request.url === `/status/${requestedSatusCode}`
      ) {
        response.writeHead(parseInt(requestedSatusCode), {
          'Content-Type': 'application/json',
        });
        response.write(
          JSON.stringify({
            [requestedSatusCode]: statusCodeObject[requestedSatusCode],
          })
        );
        response.end();
      } else {
        response.writeHead(404, { 'content-type': 'text/html' });
        response.write(`<h1>Invalid ${requestedSatusCode} code</h1>`);
        response.end();
      }

      break;
    case 'delay':
      let timeDelay = Math.abs(path.basename(request.url) * 1000);
      setTimeout(() => {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(`<h1>Response after ${timeDelay / 1000} seconds`);
        response.end();
      }, timeDelay);
      break;
    default:
      if (!path.basename(request.url)) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(
          `<h1>This is main server try searching with child urls</h1>`
        );
        response.end();
      } else {
        response.writeHead(404, { 'content-type': 'text/html' });
        response.write(`<h1> check the url<h1/>`);
        response.end();
      }
  }
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
