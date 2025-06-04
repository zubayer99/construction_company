import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createVerifiedTestUser() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('TestPass123!', 12);
      // Create test user with verified email
    const user = await prisma.user.create({
      data: {
        email: 'testuser@gov.com',
        passwordHash: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'SUPPLIER',
        emailVerified: true, // Skip email verification for testing
        isActive: true,
      },
    });

    console.log('Test user created successfully:', {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    });

    // Create test users for different roles
    const roles = ['PROCUREMENT_OFFICER', 'AUDITOR', 'CITIZEN'];
    
    for (const role of roles) {      const roleUser = await prisma.user.create({
        data: {
          email: `test${role.toLowerCase()}@gov.com`,
          passwordHash: hashedPassword,
          firstName: 'Test',
          lastName: role.replace('_', ' '),
          role: role as any,
          emailVerified: true,
          isActive: true,
        },
      });
      
      console.log(`Test ${role} user created:`, {
        id: roleUser.id,
        email: roleUser.email,
        role: roleUser.role,
      });
    }

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createVerifiedTestUser();
