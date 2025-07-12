const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Project Schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

async function cleanupDuplicates() {
  try {
    console.log('🔍 Starting duplicate project cleanup...');
    
    // Get all projects
    const allProjects = await Project.find({}).populate('companyId', 'name');
    console.log(`📊 Total projects found: ${allProjects.length}`);
    
    // Group projects by company and name
    const groupedProjects = {};
    
    allProjects.forEach(project => {
      const companyName = project.companyId?.name || 'Unknown Company';
      const key = `${companyName}_${project.name}`;
      
      if (!groupedProjects[key]) {
        groupedProjects[key] = [];
      }
      groupedProjects[key].push(project);
    });
    
    // Find duplicates
    const duplicates = [];
    Object.entries(groupedProjects).forEach(([key, projects]) => {
      if (projects.length > 1) {
        duplicates.push({
          key,
          projects,
          count: projects.length
        });
      }
    });
    
    console.log(`⚠️ Found ${duplicates.length} groups of duplicate projects:`);
    
    duplicates.forEach((duplicate, index) => {
      console.log(`\n${index + 1}. ${duplicate.key} (${duplicate.count} duplicates):`);
      duplicate.projects.forEach((project, pIndex) => {
        console.log(`   ${pIndex + 1}. ID: ${project._id}, Created: ${project.createdAt}, Owner: ${project.owner}`);
      });
    });
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicate projects found!');
      return;
    }
    
    // Ask user if they want to clean up
    console.log('\n🧹 To clean up duplicates, run this script with the --cleanup flag');
    console.log('   Example: node cleanup-duplicates.js --cleanup');
    
    if (process.argv.includes('--cleanup')) {
      console.log('\n🗑️ Starting cleanup process...');
      
      for (const duplicate of duplicates) {
        // Keep the oldest project, delete the rest
        const sortedProjects = duplicate.projects.sort((a, b) => a.createdAt - b.createdAt);
        const toDelete = sortedProjects.slice(1);
        
        console.log(`\n📝 Keeping: ${sortedProjects[0].name} (ID: ${sortedProjects[0]._id})`);
        
        for (const project of toDelete) {
          console.log(`🗑️ Deleting: ${project.name} (ID: ${project._id})`);
          await Project.findByIdAndDelete(project._id);
        }
      }
      
      console.log('\n✅ Cleanup completed!');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    mongoose.disconnect();
  }
}

cleanupDuplicates(); 