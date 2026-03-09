const http = require('http');

const options = {
  hostname: 'localhost',
  port: 1000,
  path: '/cars',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:5173',
    'Access-Control-Request-Method': 'GET'
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${res.headers['access-control-allow-origin'] || 'NONE'}`);
  process.exit(0);
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
  process.exit(1);
});

req.end();
