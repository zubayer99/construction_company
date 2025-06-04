import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupTestOrganization() {
  try {
    console.log('🏢 Setting up test supplier organization...');

    // Create a test supplier organization
    const organization = await prisma.organization.create({
      data: {
        name: 'Test Supplier Company Ltd.',
        type: 'SUPPLIER',
        registrationNumber: 'TS-2025-001',
        taxId: 'TAX-TS-001',
        address: '123 Business District',
        city: 'Dhaka',
        state: 'Dhaka',
        zipCode: '1000',
        country: 'Bangladesh',
        contactEmail: 'contact@testsupplier.com',
        contactPhone: '+880-1-123-456-789',
        website: 'https://testsupplier.com',
        verificationStatus: 'VERIFIED',
        isActive: true,
      },
    });

    console.log('✅ Organization created:', organization.name);

    // Find the test supplier user
    const supplierUser = await prisma.user.findUnique({
      where: { email: 'testuser@gov.com' },
    });

    if (!supplierUser) {
      console.log('❌ Test supplier user not found!');
      return;
    }

    // Update the supplier user to associate with the organization
    await prisma.user.update({
      where: { id: supplierUser.id },
      data: { organizationId: organization.id },
    });

    console.log('✅ Supplier user updated with organization ID');

    // Create a test procurement organization for the procurement officer
    const procurementOrg = await prisma.organization.create({
      data: {
        name: 'Ministry of ICT - Procurement Division',
        type: 'GOVERNMENT_AGENCY',
        registrationNumber: 'GOV-ICT-2025',
        taxId: 'GOV-TAX-ICT',
        address: 'ICT Tower, Agargaon',
        city: 'Dhaka',
        state: 'Dhaka',
        zipCode: '1207',
        country: 'Bangladesh',
        contactEmail: 'procurement@ict.gov.bd',
        contactPhone: '+880-2-123-456-789',
        website: 'https://ict.gov.bd',
        verificationStatus: 'VERIFIED',
        isActive: true,
      },
    });

    console.log('✅ Procurement organization created:', procurementOrg.name);

    // Find the test procurement officer user
    const procurementUser = await prisma.user.findUnique({
      where: { email: 'testprocurement_officer@gov.com' },
    });

    if (procurementUser) {
      // Update the procurement officer to associate with the organization
      await prisma.user.update({
        where: { id: procurementUser.id },
        data: { organizationId: procurementOrg.id },
      });
      console.log('✅ Procurement officer updated with organization ID');
    }

    console.log('\n🎉 Test organizations setup completed successfully!');
    console.log(`📊 Organizations created:`);
    console.log(`   - Supplier: ${organization.name} (ID: ${organization.id})`);
    console.log(`   - Procurement: ${procurementOrg.name} (ID: ${procurementOrg.id})`);
  } catch (error) {
    console.error('❌ Error setting up test organizations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestOrganization();
