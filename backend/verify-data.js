// Database verification script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  try {
    console.log('🔍 Verifying database content...\n');

    // Check company info
    const companyInfo = await prisma.companyInfo.findFirst();
    console.log('📊 Company Info:', companyInfo ? 'Found' : 'Missing');

    // Check services
    const servicesCount = await prisma.service.count();
    console.log('🛠️  Services:', servicesCount, 'records');

    // Check projects
    const projectsCount = await prisma.project.count();
    console.log('📁 Projects:', projectsCount, 'records');

    // Check team members
    const teamCount = await prisma.teamMember.count();
    console.log('👥 Team Members:', teamCount, 'records');

    // Check testimonials
    const testimonialsCount = await prisma.testimonial.count();
    console.log('💬 Testimonials:', testimonialsCount, 'records');

    // Check blog posts
    const blogPostsCount = await prisma.blogPost.count();
    console.log('📝 Blog Posts:', blogPostsCount, 'records');

    // Check blog categories
    const blogCategoriesCount = await prisma.blogCategory.count();
    console.log('📂 Blog Categories:', blogCategoriesCount, 'records');

    console.log('\n✅ Database verification completed!');

  } catch (error) {
    console.error('❌ Database verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();
