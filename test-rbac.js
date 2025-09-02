const axios = require('axios');

async function testRBAC() {
  try {
    // First, login as admin
    console.log('Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.access_token;
    console.log('Admin login successful');
    
    // Login as a regular client
    console.log('Logging in as regular client...');
    const clientLoginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'contact@acme.com',
      password: 'password123'
    });
    
    const clientToken = clientLoginResponse.data.access_token;
    console.log('Client login successful');
    
    // Test 1: Admin can see all clients
    console.log('\n--- Test 1: Admin can see all clients ---');
    try {
      const adminClientsResponse = await axios.get('http://localhost:3000/clients', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      console.log(`Admin can see ${adminClientsResponse.data.length} clients`);
    } catch (error) {
      console.error('Admin failed to see all clients:', error.response?.data || error.message);
    }
    
    // Test 2: Client cannot see all clients
    console.log('\n--- Test 2: Client cannot see all clients ---');
    try {
      await axios.get('http://localhost:3000/clients', {
        headers: {
          'Authorization': `Bearer ${clientToken}`
        }
      });
      console.log('ERROR: Client was able to see all clients (should not be allowed)');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('SUCCESS: Client correctly blocked from seeing all clients');
      } else {
        console.error('Unexpected error:', error.response?.data || error.message);
      }
    }
    
    // Test 3: Client can see their own profile
    console.log('\n--- Test 3: Client can see their own profile ---');
    try {
      const clientProfileResponse = await axios.get('http://localhost:3000/clients/6', {
        headers: {
          'Authorization': `Bearer ${clientToken}`
        }
      });
      console.log(`Client can see their own profile: ${clientProfileResponse.data.name}`);
    } catch (error) {
      console.error('Client failed to see their own profile:', error.response?.data || error.message);
    }
    
    // Test 4: Client cannot see another client's profile
    console.log('\n--- Test 4: Client cannot see another client\'s profile ---');
    try {
      await axios.get('http://localhost:3000/clients/7', {
        headers: {
          'Authorization': `Bearer ${clientToken}`
        }
      });
      console.log('ERROR: Client was able to see another client\'s profile (should not be allowed)');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('SUCCESS: Client correctly blocked from seeing another client\'s profile');
      } else {
        console.error('Unexpected error:', error.response?.data || error.message);
      }
    }
    
    // Test 5: Admin can see all projects
    console.log('\n--- Test 5: Admin can see all projects ---');
    try {
      const adminProjectsResponse = await axios.get('http://localhost:3000/projects', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      console.log(`Admin can see ${adminProjectsResponse.data.length} projects`);
    } catch (error) {
      console.error('Admin failed to see all projects:', error.response?.data || error.message);
    }
    
    // Test 6: Client can see only their own projects
    console.log('\n--- Test 6: Client can see only their own projects ---');
    try {
      const clientProjectsResponse = await axios.get('http://localhost:3000/projects', {
        headers: {
          'Authorization': `Bearer ${clientToken}`
        }
      });
      console.log(`Client can see ${clientProjectsResponse.data.length} of their own projects`);
    } catch (error) {
      console.error('Client failed to see their own projects:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testRBAC();