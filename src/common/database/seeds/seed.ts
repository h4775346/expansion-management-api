import { DataSource } from 'typeorm';
import { Client } from '../../../clients/entities/client.entity';
import { Service } from '../../../common/entities/service.entity';
import { Vendor } from '../../../vendors/entities/vendor.entity';
import { VendorService } from '../../../vendors/entities/vendor-service.entity';
import { VendorCountry } from '../../../vendors/entities/vendor-country.entity';
import { Project } from '../../../projects/entities/project.entity';
import { ProjectService } from '../../../projects/entities/project-service.entity';

import * as bcrypt from 'bcrypt';

async function seedDatabase() {
  // Create DataSource instance
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3307'),
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DB || 'expansion_management',
    entities: [
      Client,
      Service,
      Vendor,
      VendorService,
      VendorCountry,
      Project,
      ProjectService,
    ],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();
  console.log('Database connection initialized');

  const clientRepository = dataSource.getRepository(Client);
  const serviceRepository = dataSource.getRepository(Service);
  const vendorRepository = dataSource.getRepository(Vendor);
  const vendorServiceRepository = dataSource.getRepository(VendorService);
  const vendorCountryRepository = dataSource.getRepository(VendorCountry);
  const projectRepository = dataSource.getRepository(Project);
  const projectServiceRepository = dataSource.getRepository(ProjectService);

  // Clear existing data (optional, for development)
  // await projectServiceRepository.query('DELETE FROM project_services');
  // await projectRepository.query('DELETE FROM projects');
  // await vendorCountryRepository.query('DELETE FROM vendor_countries');
  // await vendorServiceRepository.query('DELETE FROM vendor_services');
  // await vendorRepository.query('DELETE FROM vendors');
  // await serviceRepository.query('DELETE FROM services');
  // await clientRepository.query('DELETE FROM clients');

  // Create default admin user
  const adminEmail = 'admin@example.com';
  const adminExists = await clientRepository.findOne({
    where: { email: adminEmail },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = clientRepository.create({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin', // Set the role to admin
    });
    await clientRepository.save(admin);
    console.log('Admin user created with email: admin@example.com and password: admin123');
  } else {
    // Update existing admin user to have admin role
    await clientRepository.update({ email: adminEmail }, { role: 'admin' });
    console.log('Admin user role updated to admin');
  }

  // Create services
  const serviceNames = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'DevOps',
    'Cloud Infrastructure',
    'Data Analytics',
    'Cybersecurity',
    'AI/Machine Learning',
    'Blockchain',
    'IoT Solutions',
  ];

  const services = [];
  for (const serviceName of serviceNames) {
    const existingService = await serviceRepository.findOne({
      where: { name: serviceName },
    });
    
    if (!existingService) {
      const service = serviceRepository.create({ name: serviceName });
      const savedService = await serviceRepository.save(service);
      services.push(savedService);
      console.log(`Service created: ${serviceName}`);
    } else {
      services.push(existingService);
    }
  }

  // Create vendors
  const vendorsData = [
    {
      name: 'Tech Solutions Inc.',
      rating: 4.8,
      response_sla_hours: 24,
      countries: ['USA', 'Canada'],
      services: [services[0].name, services[1].name, services[2].name], // Web, Mobile, UI/UX
    },
    {
      name: 'Cloud Experts LLC',
      rating: 4.6,
      response_sla_hours: 48,
      countries: ['UK', 'Germany', 'France'],
      services: [services[4].name, services[5].name], // Cloud, Data Analytics
    },
    {
      name: 'Security First Ltd.',
      rating: 4.9,
      response_sla_hours: 12,
      countries: ['USA', 'UK', 'Australia'],
      services: [services[6].name, services[7].name], // Cybersecurity, AI/ML
    },
    {
      name: 'Innovate Tech Co.',
      rating: 4.5,
      response_sla_hours: 36,
      countries: ['Japan', 'South Korea', 'Singapore'],
      services: [services[0].name, services[3].name, services[8].name], // Web, DevOps, Blockchain
    },
    {
      name: 'Global IT Services',
      rating: 4.3,
      response_sla_hours: 72,
      countries: ['India', 'Brazil', 'Mexico'],
      services: [services[1].name, services[5].name, services[9].name], // Mobile, Data Analytics, IoT
    },
  ];

  const vendors = [];
  for (const vendorData of vendorsData) {
    const existingVendor = await vendorRepository.findOne({
      where: { name: vendorData.name },
    });

    if (!existingVendor) {
      const vendor = vendorRepository.create({
        name: vendorData.name,
        rating: vendorData.rating,
        response_sla_hours: vendorData.response_sla_hours,
      });
      const savedVendor = await vendorRepository.save(vendor);
      vendors.push(savedVendor);

      // Add vendor countries
      for (const country of vendorData.countries) {
        const vendorCountry = vendorCountryRepository.create({
          vendor_id: savedVendor.id,
          country: country,
        });
        await vendorCountryRepository.save(vendorCountry);
      }

      // Add vendor services
      for (const serviceName of vendorData.services) {
        const service = services.find(s => s.name === serviceName);
        if (service) {
          const vendorService = vendorServiceRepository.create({
            vendor_id: savedVendor.id,
            service_id: service.id,
          });
          await vendorServiceRepository.save(vendorService);
        }
      }

      console.log(`Vendor created: ${vendorData.name}`);
    } else {
      vendors.push(existingVendor);
    }
  }

  // Create clients (non-admin) with real emails
  const clientsData = [
    { name: 'Protik Service', email: 'englishh7366@gmail.com' },
    { name: 'Abanoub Hany', email: 'sw.abanoub.hany@gmail.com' },
    { name: 'Ali Hany', email: 'a10979516@gmail.com' },
    { name: 'Yahoo User', email: 'englishh7366@yahoo.com' },
  ];

  const clients = [];
  for (const clientData of clientsData) {
    const existingClient = await clientRepository.findOne({
      where: { email: clientData.email },
    });

    if (!existingClient) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const client = clientRepository.create({
        name: clientData.name,
        email: clientData.email,
        password: hashedPassword,
        role: 'client', // Set the role to client
      });
      const savedClient = await clientRepository.save(client);
      clients.push(savedClient);
      console.log(`Client created: ${clientData.name} (${clientData.email})`);
    } else {
      clients.push(existingClient);
    }
  }

  // Create projects
  const projectsData = [
    {
      client: clients[0],
      country: 'USA',
      budget: 50000,
      status: 'active',
      services: [services[0].name, services[2].name], // Web, UI/UX
    },
    {
      client: clients[1],
      country: 'UK',
      budget: 75000,
      status: 'active',
      services: [services[1].name, services[3].name, services[4].name], // Mobile, DevOps, Cloud
    },
    {
      client: clients[2],
      country: 'Germany',
      budget: 100000,
      status: 'active',
      services: [services[5].name, services[6].name], // Data Analytics, Cybersecurity
    },
    {
      client: clients[3],
      country: 'Japan',
      budget: 125000,
      status: 'active',
      services: [services[7].name, services[8].name], // AI/ML, Blockchain
    },
  ];

  const projects = [];
  for (const projectData of projectsData) {
    // Check if project already exists
    const existingProject = await projectRepository.findOne({
      where: {
        client_id: projectData.client.id,
        country: projectData.country,
      },
    });

    let savedProject;
    if (!existingProject) {
      const project = projectRepository.create({
        client_id: projectData.client.id,
        country: projectData.country,
        budget: projectData.budget,
        status: projectData.status,
      });
      savedProject = await projectRepository.save(project);
      projects.push(savedProject);

      // Add project services
      for (const serviceName of projectData.services) {
        const service = services.find(s => s.name === serviceName);
        if (service) {
          const projectService = projectServiceRepository.create({
            project_id: savedProject.id,
            service_id: service.id,
          });
          await projectServiceRepository.save(projectService);
        }
      }

      console.log(`Project created for ${projectData.client.name} in ${projectData.country}`);
    } else {
      projects.push(existingProject);
      savedProject = existingProject;
    }
  }

  // Create research docs in MongoDB
  try {
    // We need to connect to MongoDB separately for research docs
    const { default: mongoose } = await import('mongoose');
    const { ResearchDocSchema } = await import('../../../research/schemas/research-doc.schema');
    
    // Create model from schema
    const ResearchDocModel = mongoose.model('ResearchDoc', ResearchDocSchema);
    
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expansion_management');
    console.log('MongoDB connection initialized for research docs seeding');
    
    // Clear existing research docs (optional, for development)
    // await ResearchDocModel.deleteMany({});
    
    // Create research docs
    const researchDocsData = [
      {
        projectId: projects[0].id.toString(),
        title: 'Market Analysis for USA Expansion',
        content: 'Comprehensive market analysis for expanding web development services in the USA market. Key findings include high demand for responsive web applications and growing interest in progressive web apps.',
        tags: ['market-analysis', 'USA', 'web-development'],
      },
      {
        projectId: projects[0].id.toString(),
        title: 'Competitor Research - Tech Solutions Inc.',
        content: 'Detailed analysis of Tech Solutions Inc. competitor in the USA market. Strengths include fast delivery and competitive pricing. Weaknesses include limited mobile app expertise.',
        tags: ['competitor', 'USA', 'Tech Solutions Inc.'],
      },
      {
        projectId: projects[1].id.toString(),
        title: 'UK Mobile App Market Trends',
        content: 'Analysis of current mobile app market trends in the UK. Key trends include increased demand for cross-platform solutions and growing interest in AR/VR features.',
        tags: ['market-trends', 'UK', 'mobile-apps'],
      },
      {
        projectId: projects[2].id.toString(),
        title: 'German Cybersecurity Regulations',
        content: 'Overview of cybersecurity regulations and compliance requirements for businesses operating in Germany. Key regulations include GDPR and additional local data protection laws.',
        tags: ['regulations', 'Germany', 'cybersecurity'],
      },
      {
        projectId: projects[3].id.toString(),
        title: 'Japanese AI Market Opportunities',
        content: 'Exploration of AI market opportunities in Japan. Key areas include robotics integration, natural language processing, and computer vision applications.',
        tags: ['market-opportunities', 'Japan', 'AI'],
      },
    ];
    
    for (const docData of researchDocsData) {
      // Check if research doc already exists
      const existingDoc = await ResearchDocModel.findOne({
        projectId: docData.projectId,
        title: docData.title,
      });
      
      if (!existingDoc) {
        const researchDoc = new ResearchDocModel(docData);
        await researchDoc.save();
        console.log(`Research doc created: ${docData.title}`);
      }
    }
    
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding research docs:', error);
  }

  await dataSource.destroy();
  console.log('Database seeding completed successfully!');
}

seedDatabase().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});