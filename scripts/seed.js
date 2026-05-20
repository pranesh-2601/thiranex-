require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../backend/config/database');
const Project = require('../backend/models/Project');

const sampleProjects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured online store with cart, payments, and admin dashboard.',
    longDescription: 'Built with React and Node.js, this platform handles thousands of products with real-time inventory tracking, Stripe payment integration, and a powerful admin panel.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redis'],
    category: 'web',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    featured: true,
    order: 1
  },
  {
    title: 'AI Chat Assistant',
    description: 'A conversational AI powered by LLMs with multi-turn context and memory.',
    longDescription: 'Integrates with the Claude API to provide intelligent conversations. Features include conversation history, custom personas, and export functionality.',
    techStack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Claude API'],
    category: 'ai',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/ai-chat',
    featured: true,
    order: 2
  },
  {
    title: 'Task Manager App',
    description: 'A productivity app with real-time collaboration and Kanban boards.',
    longDescription: 'Teams can collaborate in real-time using WebSockets. Features drag-and-drop Kanban boards, deadlines, file attachments, and Slack integration.',
    techStack: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
    category: 'web',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/task-manager',
    featured: false,
    order: 3
  },
  {
    title: 'Weather Dashboard',
    description: 'Beautiful real-time weather dashboard with forecasts and analytics.',
    longDescription: 'Fetches data from OpenWeatherMap API. Shows current conditions, 7-day forecasts, precipitation charts, and stores historical data in MongoDB.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
    category: 'web',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/weather-app',
    featured: false,
    order: 4
  },
  {
    title: 'REST API Boilerplate',
    description: 'Production-ready Node.js REST API with auth, docs, and CI/CD pipeline.',
    longDescription: 'A comprehensive starter template with JWT authentication, role-based access control, Swagger docs, rate limiting, and GitHub Actions CI/CD.',
    techStack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'],
    category: 'backend',
    liveUrl: '',
    githubUrl: 'https://github.com/yourusername/api-boilerplate',
    featured: false,
    order: 5
  },
  {
    title: 'Mobile Fitness Tracker',
    description: 'Cross-platform mobile app for tracking workouts and nutrition.',
    longDescription: 'Built with React Native for iOS and Android. Features workout logging, progress charts, macro tracking, and integration with Apple Health / Google Fit.',
    techStack: ['React Native', 'Expo', 'Firebase', 'Redux'],
    category: 'mobile',
    liveUrl: '',
    githubUrl: 'https://github.com/yourusername/fitness-tracker',
    featured: true,
    order: 6
  }
];

async function seed() {
  try {
    await connectDB();
    
    // Clear existing
    await Project.deleteMany({});
    console.log('🗑️  Cleared existing projects');

    // Insert sample data
    const inserted = await Project.insertMany(sampleProjects);
    console.log(`✅ Seeded ${inserted.length} projects`);

    // Display summary
    inserted.forEach(p => console.log(`   - ${p.title} [${p.category}]${p.featured ? ' ⭐' : ''}`));

    await mongoose.connection.close();
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
