// Create Admin Account Script
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin account...');
    
    // Check if admin already exists
    const existing = await prisma.staffAccount.findUnique({
      where: { username: 'admin' }
    });

    if (existing) {
      console.log('Admin account already exists. Updating password...');
      
      // Hash new password
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      // Update existing admin
      const updated = await prisma.staffAccount.update({
        where: { username: 'admin' },
        data: {
          passwordHash,
          isActive: true,
          role: 'ADMIN',
          displayName: 'Administrator'
        }
      });
      
      console.log('✅ Admin account updated successfully!');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ID:', updated.id.toString());
      console.log('   Role:', updated.role);
    } else {
      console.log('Creating new admin account...');
      
      // Hash password
      const passwordHash = await bcrypt.hash('admin123', 10);
      
      // Create new admin
      const admin = await prisma.staffAccount.create({
        data: {
          username: 'admin',
          passwordHash,
          role: 'ADMIN',
          displayName: 'Administrator',
          isActive: true,
          isOnline: false
        }
      });
      
      console.log('✅ Admin account created successfully!');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ID:', admin.id.toString());
      console.log('   Role:', admin.role);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
