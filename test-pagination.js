const axios = require('axios');

async function testPagination() {
  try {
    // First, login as admin
    console.log('Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.access_token;
    console.log('Admin login successful');
    
    // Test clients pagination
    console.log('\n--- Testing Clients Pagination ---');
    try {
      const clientsResponse = await axios.get('http://localhost:3000/clients?page=1&limit=5', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log(`Clients page 1, limit 5:`);
      console.log(`  Total items: ${clientsResponse.data.meta.totalItems}`);
      console.log(`  Current page: ${clientsResponse.data.meta.currentPage}`);
      console.log(`  Items per page: ${clientsResponse.data.meta.itemsPerPage}`);
      console.log(`  Total pages: ${clientsResponse.data.meta.totalPages}`);
      console.log(`  Data items: ${clientsResponse.data.data.length}`);
    } catch (error) {
      console.error('Clients pagination failed:', error.response?.data || error.message);
    }
    
    // Test projects pagination
    console.log('\n--- Testing Projects Pagination ---');
    try {
      const projectsResponse = await axios.get('http://localhost:3000/projects?page=1&limit=3', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log(`Projects page 1, limit 3:`);
      console.log(`  Total items: ${projectsResponse.data.meta.totalItems}`);
      console.log(`  Current page: ${projectsResponse.data.meta.currentPage}`);
      console.log(`  Items per page: ${projectsResponse.data.meta.itemsPerPage}`);
      console.log(`  Total pages: ${projectsResponse.data.meta.totalPages}`);
      console.log(`  Data items: ${projectsResponse.data.data.length}`);
    } catch (error) {
      console.error('Projects pagination failed:', error.response?.data || error.message);
    }
    
    // Test vendors pagination
    console.log('\n--- Testing Vendors Pagination ---');
    try {
      const vendorsResponse = await axios.get('http://localhost:3000/vendors?page=1&limit=2', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      console.log(`Vendors page 1, limit 2:`);
      console.log(`  Total items: ${vendorsResponse.data.meta.totalItems}`);
      console.log(`  Current page: ${vendorsResponse.data.meta.currentPage}`);
      console.log(`  Items per page: ${vendorsResponse.data.meta.itemsPerPage}`);
      console.log(`  Total pages: ${vendorsResponse.data.meta.totalPages}`);
      console.log(`  Data items: ${vendorsResponse.data.data.length}`);
    } catch (error) {
      console.error('Vendors pagination failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testPagination();