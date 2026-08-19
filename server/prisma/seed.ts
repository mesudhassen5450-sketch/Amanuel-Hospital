/**
 * Database Seed Script using node-postgres (pg)
 * 
 * This script bypasses Prisma Client to avoid PgBouncer prepared statement issues
 * and IPv6 connectivity problems. It uses raw SQL with the standard pg library
 * which works reliably over IPv4 port 6543 pooler connection.
 */

import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

// Use IPv4-compatible pooler host with statement_cache_size=0 for PgBouncer compatibility
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres.effhdgpklekbwmvmqlfe:Mh0954501670@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&statement_cache_size=0';

// Create connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  // Disable prepared statements for PgBouncer compatibility
  statement_timeout: 30000, // 30 seconds
  query_timeout: 30000,
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    console.log('📡 Connected to Supabase via IPv4 pooler');

    // Default password for all staff accounts
    const defaultPassword = 'Password123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    console.log('🔐 Password hashed successfully');

    // Define staff accounts to seed
    const staffAccounts = [
      { username: 'admin', role: 'ADMIN', displayName: 'System Administrator' },
      { username: 'dr.amanuel', role: 'DOCTOR', displayName: 'Dr. Amanuel' },
      { username: 'receptionist', role: 'RECEPTIONIST', displayName: 'Front Desk' },
      { username: 'pharmacist', role: 'PHARMACIST', displayName: 'Pharmacy Tech' },
      { username: 'labtech', role: 'LAB_TECH', displayName: 'Lab Specialist' },
      { username: 'cashier', role: 'CASHIER', displayName: 'Billing Officer' },
    ];

    // Seed staff accounts using raw SQL with ON CONFLICT
    console.log('👥 Seeding staff accounts...');
    
    for (const account of staffAccounts) {
      const insertStaffQuery = `
        INSERT INTO staff_accounts (username, password_hash, role, display_name, is_active, is_online, created_at, updated_at)
        VALUES ($1, $2, $3, $4, true, false, NOW(), NOW())
        ON CONFLICT (username) DO NOTHING
        RETURNING username;
      `;

      const result = await client.query(insertStaffQuery, [
        account.username,
        hashedPassword,
        account.role,
        account.displayName,
      ]);

      if (result.rowCount && result.rowCount > 0) {
        console.log(`  ✅ Created staff account: ${account.username} (${account.role})`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${account.username}`);
      }
    }

    // Seed doctor record for dr.amanuel (optional - only if table exists)
    console.log('👨‍⚕️ Seeding doctor profile...');
    
    try {
      const insertDoctorQuery = `
        INSERT INTO doctors (username, specialty, experience, is_available, created_at, updated_at)
        VALUES ($1, $2, $3, true, NOW(), NOW())
        ON CONFLICT (username) DO NOTHING
        RETURNING username;
      `;

      const doctorResult = await client.query(insertDoctorQuery, [
        'dr.amanuel',
        'General Medicine & Telehealth',
        '10 Years',
      ]);

      if (doctorResult.rowCount && doctorResult.rowCount > 0) {
        console.log('  ✅ Created doctor profile: dr.amanuel');
      } else {
        console.log('  ⏭️  Skipped (already exists): dr.amanuel');
      }
    } catch (error: any) {
      if (error.code === '42P01') {
        console.log('  ⚠️  Doctors table does not exist yet - skipping doctor profile');
        console.log('  💡 Run database migrations to create the doctors table');
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

    console.log('');
    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📋 Default Login Credentials:');
    console.log('   Username: admin, dr.amanuel, receptionist, pharmacist, labtech, cashier');
    console.log('   Password: Password123!');
    console.log('');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  } finally {
    // Release client back to pool
    client.release();
    console.log('🔌 Database connection released');
  }
}

// Main execution
async function main() {
  try {
    await seedDatabase();
  } catch (error) {
    console.error('💥 Fatal error during seeding');
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
    console.log('👋 Database pool closed');
  }
}

// Run the seed script
main();
