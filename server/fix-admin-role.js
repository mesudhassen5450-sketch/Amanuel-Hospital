const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Check current admin user
    const admin = await prisma.staffAccount.findUnique({
      where: { username: 'admin' }
    });

    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('Current admin user:');
    console.log({
      id: admin.id.toString(),
      username: admin.username,
      role: admin.role,
      isActive: admin.isActive
    });

    // Update to ensure role is uppercase ADMIN
    if (admin.role !== 'ADMIN') {
      console.log('\n🔧 Updating admin role to "ADMIN"...');
      
      await prisma.staffAccount.update({
        where: { username: 'admin' },
        data: { role: 'ADMIN' }
      });

      console.log('✅ Admin role updated to ADMIN');
    } else {
      console.log('\n✅ Admin role is already set to ADMIN');
    }

    // Verify the update
    const updated = await prisma.staffAccount.findUnique({
      where: { username: 'admin' }
    });

    console.log('\nFinal admin user:');
    console.log({
      id: updated.id.toString(),
      username: updated.username,
      role: updated.role,
      isActive: updated.isActive
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
