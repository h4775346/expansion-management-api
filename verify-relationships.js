// Script to verify database relationships between clients, projects, and research documents
const { DataSource } = require('typeorm');
const mongoose = require('mongoose');

// MySQL configuration
const mysqlConfig = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3307'),
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DB || 'expansion_management',
  entities: [
    __dirname + '/dist/clients/entities/client.entity.js',
    __dirname + '/dist/projects/entities/project.entity.js',
  ],
  synchronize: false,
  logging: false,
};

// MongoDB configuration
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expansion_management';

async function verifyRelationships() {
  console.log('🔍 Verifying database relationships...\n');
  
  try {
    // Connect to MySQL
    console.log('1. Connecting to MySQL...');
    const dataSource = new DataSource(mysqlConfig);
    await dataSource.initialize();
    console.log('   ✅ MySQL connection established\n');
    
    const clientRepository = dataSource.getRepository('Client');
    const projectRepository = dataSource.getRepository('Project');
    
    // Connect to MongoDB
    console.log('2. Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('   ✅ MongoDB connection established\n');
    
    // Get all clients
    console.log('3. Retrieving clients...');
    const clients = await clientRepository.find();
    console.log(`   Found ${clients.length} clients:`);
    clients.forEach(client => {
      console.log(`   - ID: ${client.id}, Email: ${client.email}, Role: ${client.role}`);
    });
    console.log();
    
    // Get all projects
    console.log('4. Retrieving projects...');
    const projects = await projectRepository.find({ relations: ['client'] });
    console.log(`   Found ${projects.length} projects:`);
    projects.forEach(project => {
      console.log(`   - ID: ${project.id}, Client: ${project.client.name} (ID: ${project.client_id}), Country: ${project.country}`);
    });
    console.log();
    
    // Get research documents from MongoDB
    console.log('5. Retrieving research documents...');
    const researchDocs = await mongoose.connection.db.collection('research_docs').find({}).toArray();
    console.log(`   Found ${researchDocs.length} research documents:`);
    researchDocs.forEach(doc => {
      console.log(`   - ID: ${doc._id}, Project ID: ${doc.projectId}, Title: ${doc.title}`);
    });
    console.log();
    
    // Verify relationships
    console.log('6. Verifying relationships...');
    
    // Check if all research documents have valid project IDs
    const projectIds = projects.map(p => p.id.toString());
    const orphanedDocs = researchDocs.filter(doc => !projectIds.includes(doc.projectId));
    
    if (orphanedDocs.length > 0) {
      console.log(`   ⚠️  Found ${orphanedDocs.length} research documents with invalid project IDs:`);
      orphanedDocs.forEach(doc => {
        console.log(`     - ${doc.title} (Project ID: ${doc.projectId})`);
      });
    } else {
      console.log('   ✅ All research documents have valid project IDs');
    }
    
    // Show which clients own which projects and research documents
    console.log('\n7. Client -> Project -> Research Document relationships:');
    for (const client of clients) {
      const clientProjects = projects.filter(p => p.client_id === client.id);
      console.log(`   ${client.name} (${client.role}):`);
      console.log(`     Projects: ${clientProjects.length}`);
      
      for (const project of clientProjects) {
        const projectDocs = researchDocs.filter(doc => doc.projectId === project.id.toString());
        console.log(`       - ${project.country}: ${projectDocs.length} research documents`);
      }
    }
    
    // Close connections
    await dataSource.destroy();
    await mongoose.disconnect();
    
    console.log('\n✅ Verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
    console.error(error.stack);
  }
}

verifyRelationships();