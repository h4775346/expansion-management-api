// Test script to verify research document role-based filtering
const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const CLIENT_EMAIL = 'englishh7366@gmail.com';
const CLIENT_PASSWORD = 'password123';

async function testResearchFiltering() {
  try {
    console.log('Testing research document role-based filtering...\n');
    
    // Login as admin
    console.log('1. Logging in as admin...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    const adminToken = adminLoginResponse.data.access_token;
    console.log('   Admin token received\n');
    
    // Login as client
    console.log('2. Logging in as client...');
    const clientLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: CLIENT_EMAIL,
      password: CLIENT_PASSWORD
    });
    
    const clientToken = clientLoginResponse.data.access_token;
    console.log('   Client token received\n');
    
    // Get all research documents as admin
    console.log('3. Getting all research documents as admin...');
    const adminResearchResponse = await axios.get(`${BASE_URL}/research`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log(`   Admin sees ${adminResearchResponse.data.meta.totalItems} research documents\n`);
    
    // Get all research documents as client
    console.log('4. Getting all research documents as client...');
    const clientResearchResponse = await axios.get(`${BASE_URL}/research`, {
      headers: {
        'Authorization': `Bearer ${clientToken}`
      }
    });
    
    console.log(`   Client sees ${clientResearchResponse.data.meta.totalItems} research documents\n`);
    
    // Compare results
    if (adminResearchResponse.data.meta.totalItems > clientResearchResponse.data.meta.totalItems) {
      console.log('✅ SUCCESS: Role-based filtering is working correctly!');
      console.log(`   Admin sees all ${adminResearchResponse.data.meta.totalItems} documents`);
      console.log(`   Client only sees ${clientResearchResponse.data.meta.totalItems} documents`);
    } else {
      console.log('⚠️  WARNING: Filtering may not be working as expected');
    }
    
  } catch (error) {
    console.error('Error during testing:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

// Run the test
testResearchFiltering();