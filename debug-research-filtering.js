const axios = require('axios');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const CLIENT_EMAIL = 'englishh7366@gmail.com';
const CLIENT_PASSWORD = 'password123';

async function debugResearchFiltering() {
  try {
    console.log('🔍 Debugging research document filtering...\n');
    
    // Login as admin
    console.log('1. Logging in as admin...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    const adminToken = adminLoginResponse.data.access_token;
    const adminInfo = adminLoginResponse.data.client;
    console.log('   Admin token received');
    console.log('   Admin role:', adminInfo.role);
    console.log('   Admin ID:', adminInfo.id, '\n');
    
    // Login as client
    console.log('2. Logging in as client...');
    const clientLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: CLIENT_EMAIL,
      password: CLIENT_PASSWORD
    });
    
    const clientToken = clientLoginResponse.data.access_token;
    const clientInfo = clientLoginResponse.data.client;
    console.log('   Client token received');
    console.log('   Client role:', clientInfo.role);
    console.log('   Client ID:', clientInfo.id, '\n');
    
    // Get all research documents as admin
    console.log('3. Getting all research documents as admin...');
    const adminResearchResponse = await axios.get(`${BASE_URL}/research`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    
    console.log(`   Admin sees ${adminResearchResponse.data.meta.totalItems} research documents`);
    console.log('   Admin document IDs:', adminResearchResponse.data.data.map(doc => doc.projectId), '\n');
    
    // Get all research documents as client
    console.log('4. Getting all research documents as client...');
    const clientResearchResponse = await axios.get(`${BASE_URL}/research`, {
      headers: {
        'Authorization': `Bearer ${clientToken}`
      }
    });
    
    console.log(`   Client sees ${clientResearchResponse.data.meta.totalItems} research documents`);
    if (clientResearchResponse.data.data.length > 0) {
      console.log('   Client document IDs:', clientResearchResponse.data.data.map(doc => doc.projectId));
    }
    
    // Get client's projects
    console.log('\n5. Getting client projects...');
    const clientProjectsResponse = await axios.get(`${BASE_URL}/projects`, {
      headers: {
        'Authorization': `Bearer ${clientToken}`
      }
    });
    
    console.log(`   Client has ${clientProjectsResponse.data.meta.totalItems} projects`);
    if (clientProjectsResponse.data.data.length > 0) {
      console.log('   Client project IDs:', clientProjectsResponse.data.data.map(proj => proj.id.toString()));
    }
    
    // Compare results
    console.log('\n6. Analysis:');
    if (adminResearchResponse.data.meta.totalItems > clientResearchResponse.data.meta.totalItems) {
      console.log('✅ Role-based filtering appears to be working correctly!');
      console.log(`   Admin sees all ${adminResearchResponse.data.meta.totalItems} documents`);
      console.log(`   Client only sees ${clientResearchResponse.data.meta.totalItems} documents`);
    } else if (adminResearchResponse.data.meta.totalItems === clientResearchResponse.data.meta.totalItems) {
      console.log('⚠️  WARNING: Filtering may not be working as expected');
      console.log('   Both admin and client see the same number of documents');
      console.log('   This could indicate an issue with role-based filtering');
    } else {
      console.log('❓ Unexpected result: Client sees more documents than admin');
    }
    
  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
  }
}

// Run the debug script
debugResearchFiltering();