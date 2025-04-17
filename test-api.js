const fetch = require('node-fetch');

async function testApi() {
  try {
    console.log('Testing API endpoint: http://localhost:5000/api/recipes');
    const response = await fetch('http://localhost:5000/api/recipes');
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Data received:', JSON.stringify(data, null, 2));
      console.log('Number of recipes:', data.length);
    } else {
      console.error('Error response:', response.statusText);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi(); 