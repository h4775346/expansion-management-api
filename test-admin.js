const axios = require('axios');

async function testAdminEndpoint() {
  try {
    // First, login to get the access token
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const accessToken = loginResponse.data.access_token;
    console.log('Login successful, token received');
    
    // Use the token to access an admin-only endpoint
    const clientsResponse = await axios.get('http://localhost:3000/clients', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('Admin endpoint access successful:', clientsResponse.data);
  } catch (error) {
    console.error('Admin endpoint access failed:', error.response?.data || error.message);
  }
}

testAdminEndpoint();