const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/recipes',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Testing backend server...');
console.log('Request URL:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log('Response status:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      console.log('Response data:', jsonData);
      console.log('Number of recipes:', jsonData.length);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end(); 