const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
}

testLogin();