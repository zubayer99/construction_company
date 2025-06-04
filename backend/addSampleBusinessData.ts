import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSampleBusinessData() {
  try {
    console.log('Adding sample business data...');
    
    // Add sample users first (needed for blog posts)
    const users = [
      {
        id: 'sample-author-1',
        email: 'admin@alfatahenterprise.com',
        passwordHash: '$2a$10$example.hash.placeholder', // Placeholder hash
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN' as const,
        isActive: true
      },
      {
        id: 'sample-author-2',
        email: 'marketing@alfatahenterprise.com',
        passwordHash: '$2a$10$example.hash.placeholder',
        firstName: 'Marketing',
        lastName: 'Team',
        role: 'ADMIN' as const,
        isActive: true
      },
      {
        id: 'sample-author-3',
        email: 'research@alfatahenterprise.com',
        passwordHash: '$2a$10$example.hash.placeholder',
        firstName: 'Research',
        lastName: 'Team',
        role: 'ADMIN' as const,
        isActive: true
      }
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: user
      });
    }// Add company info
    const companyInfo = await prisma.companyInfo.upsert({
      where: { id: 'main' },
      update: {},
      create: {
        id: 'main',
        name: 'Al Fatah Enterprise',
        tagline: 'Excellence in Industrial Solutions',
        description: 'Since our establishment, we have been committed to providing high-quality products and exceptional service to our customers worldwide.',
        mission: 'To provide innovative solutions that help our clients optimize their operations, reduce costs, and achieve sustainable growth.',
        vision: 'To become the leading global provider of industrial solutions.',
        founded: new Date('2010-01-01'),
        address: '123 Business Street, Suite 100',
        city: 'Global City',
        state: 'Business State',
        zipCode: '12345',
        country: 'Bangladesh',
        phone: '+1 (123) 456-7890',
        email: 'info@alfatahenterprise.com',
        website: 'https://alfatahenterprise.com',
      }
    });    // Add services
    const services = [
      {
        title: 'Industrial Equipment Supply',
        description: 'We provide a comprehensive range of industrial equipment from leading manufacturers worldwide.',
        shortDesc: 'Complete industrial equipment solutions',
        iconName: 'factory',
        features: ['Quality assurance', '24/7 support', 'Global shipping', 'Competitive pricing'],
        isActive: true,
        sortOrder: 1
      },
      {
        title: 'Manufacturing Solutions',
        description: 'Custom manufacturing solutions tailored to meet your specific operational requirements.',
        shortDesc: 'Custom manufacturing expertise',
        iconName: 'settings',
        features: ['Custom design', 'Quality control', 'Timely delivery', 'Technical support'],
        isActive: true,
        sortOrder: 2
      },
      {
        title: 'Technical Consulting',
        description: 'Expert technical consulting services to optimize your operations and improve efficiency.',
        shortDesc: 'Expert technical guidance',
        iconName: 'users',
        features: ['Expert consultation', 'Process optimization', 'Cost reduction', 'Performance analysis'],
        isActive: true,
        sortOrder: 3
      }
    ];

    for (const service of services) {
      await prisma.service.create({
        data: service
      });
    }    // Add projects
    const projects = [
      {
        title: 'Industrial Equipment Modernization',
        description: 'Complete modernization of manufacturing facility with state-of-the-art equipment.',
        client: 'Industrial Equipment Solutions',
        imageUrl: 'https://images.pexels.com/photos/2881632/pexels-photo-2881632.jpeg',
        gallery: ['https://images.pexels.com/photos/2881632/pexels-photo-2881632.jpeg'],
        status: 'COMPLETED' as const,
        isFeatured: true,
        isActive: true,
        sortOrder: 1
      },
      {
        title: 'Manufacturing Process Optimization',
        description: 'Comprehensive optimization of manufacturing processes resulting in 30% efficiency improvement.',
        client: 'Manufacturing Tools Ltd',
        imageUrl: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg',
        gallery: ['https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg'],
        status: 'COMPLETED' as const,
        isFeatured: true,
        isActive: true,
        sortOrder: 2
      },
      {
        title: 'Safety Systems Implementation',
        description: 'Implementation of advanced safety systems across multiple facilities.',
        client: 'Safety Equipment Corp',
        imageUrl: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg',
        gallery: ['https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg'],
        status: 'COMPLETED' as const,
        isFeatured: true,
        isActive: true,
        sortOrder: 3
      }
    ];

    for (const project of projects) {
      await prisma.project.create({
        data: project
      });
    }    // Add team members
    const teamMembers = [
      {
        name: 'John Smith',
        position: 'Chief Executive Officer',
        bio: 'With over 20 years of experience in industrial solutions, John leads our company with vision and expertise.',
        imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Sarah Johnson',
        position: 'Operations Director',
        bio: 'Sarah manages our operations with precision and ensures quality delivery across all projects.',
        imageUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Michael Chen',
        position: 'Technical Manager',
        bio: 'Michael brings technical expertise and innovation to every project we undertake.',
        imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        isActive: true,
        sortOrder: 3
      }
    ];

    for (const member of teamMembers) {
      await prisma.teamMember.create({
        data: member
      });
    }    // Add testimonials
    const testimonials = [
      {
        name: 'John Smith',
        position: 'CEO',
        company: 'XYZ Industries',
        content: 'Al Fatah Enterprise has been our trusted supplier for over 5 years. Their commitment to quality and excellent customer service has made them an invaluable business partner.',
        imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        rating: 5,
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Sarah Johnson',
        position: 'Operations Director',
        company: 'ABC Manufacturing',
        content: 'The quality of products and services provided by Al Fatah Enterprise consistently exceeds our expectations. They truly understand our business needs.',
        imageUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
        rating: 5,
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Michael Chen',
        position: 'Procurement Manager',
        company: 'Tech Solutions Ltd',
        content: 'Working with Al Fatah Enterprise has streamlined our supply chain operations. Their reliability and professionalism are unmatched in the industry.',
        imageUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        rating: 5,
        isActive: true,
        sortOrder: 3
      }
    ];

    for (const testimonial of testimonials) {
      await prisma.testimonial.create({
        data: testimonial
      });
    }    // Add blog posts
    const blogPosts = [
      {
        title: 'New Product Line Launch Coming Soon',
        slug: 'new-product-line-launch',
        content: 'We are excited to announce the upcoming launch of our new product line that will revolutionize the industry...',
        excerpt: 'We\'re excited to announce the upcoming launch of our new product line that will revolutionize the industry.',
        imageUrl: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
        status: 'PUBLISHED' as const,
        publishedAt: new Date('2023-05-15'),
        authorId: 'sample-author-1',
        isFeatured: false
      },
      {
        title: 'Al Fatah Enterprise Expands Global Distribution Network',
        slug: 'global-distribution-expansion',
        content: 'We are proud to announce the expansion of our distribution network to serve clients in new international markets...',
        excerpt: 'We are proud to announce the expansion of our distribution network to serve clients in new international markets.',
        imageUrl: 'https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg',
        status: 'PUBLISHED' as const,
        publishedAt: new Date('2023-04-22'),
        authorId: 'sample-author-2',
        isFeatured: false
      },
      {
        title: 'Industry Insights: Trends to Watch in 2023',
        slug: 'industry-trends-2023',
        content: 'Our experts analyze the latest trends and developments that are shaping the future of the industry...',
        excerpt: 'Our experts analyze the latest trends and developments that are shaping the future of the industry.',
        imageUrl: 'https://images.pexels.com/photos/2977565/pexels-photo-2977565.jpeg',
        status: 'PUBLISHED' as const,
        publishedAt: new Date('2023-03-10'),
        authorId: 'sample-author-3',
        isFeatured: false
      }
    ];

    for (const post of blogPosts) {
      await prisma.blogPost.create({
        data: {
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          imageUrl: post.imageUrl,
          status: post.status,
          publishedAt: post.publishedAt,
          authorId: post.authorId,
          isFeatured: post.isFeatured
        }
      });
    }

    console.log('Sample business data added successfully!');
    console.log('- Company info created');
    console.log('- 3 services added');
    console.log('- 3 projects added');
    console.log('- 3 team members added');
    console.log('- 3 testimonials added');
    console.log('- 3 blog posts added');

  } catch (error) {
    console.error('Error adding sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleBusinessData();
