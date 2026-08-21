/**
 * JWT Token Verification Utility
 * Use this to debug and verify JWT tokens
 * 
 * Usage:
 * 1. Copy a JWT token from browser localStorage
 * 2. Run: npx tsx src/utils/verify-token.ts YOUR_TOKEN_HERE
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'amanuel_hospital_secure_jwt_secret_2026_key';

function verifyAndDecodeToken(token: string) {
  try {
    console.log('\n🔍 Token Verification Utility\n');
    console.log('━'.repeat(60));
    
    // Decode without verification (shows payload even if expired)
    const decoded = jwt.decode(token, { complete: true });
    console.log('\n📦 Token Payload (unverified):');
    console.log(JSON.stringify(decoded, null, 2));
    
    // Verify with secret
    console.log('\n━'.repeat(60));
    console.log('\n✅ Verifying with JWT_SECRET...');
    const verified = jwt.verify(token, JWT_SECRET) as any;
    
    console.log('\n✅ Token is VALID!');
    console.log('\nUser Information:');
    console.log(`  ID:       ${verified.id}`);
    console.log(`  Username: ${verified.username}`);
    console.log(`  Role:     ${verified.role}`);
    console.log(`  Issued:   ${new Date(verified.iat * 1000).toLocaleString()}`);
    console.log(`  Expires:  ${new Date(verified.exp * 1000).toLocaleString()}`);
    
    // Check if role is uppercase
    if (verified.role !== verified.role?.toUpperCase()) {
      console.log('\n⚠️  WARNING: Role is not uppercase!');
      console.log(`  Current:  "${verified.role}"`);
      console.log(`  Expected: "${verified.role?.toUpperCase()}"`);
      console.log('\n  This will cause 403 errors. User needs to log in again.');
    } else {
      console.log('\n✅ Role is properly uppercase');
    }
    
    console.log('\n━'.repeat(60));
    
  } catch (error: any) {
    console.error('\n❌ Token Verification Failed!');
    console.error(`\nError: ${error.message}`);
    
    if (error.name === 'TokenExpiredError') {
      console.error('\n⏰ Token has expired. User needs to log in again.');
    } else if (error.name === 'JsonWebTokenError') {
      console.error('\n🔐 Invalid token signature or malformed token.');
    }
    
    console.log('\n━'.repeat(60));
    process.exit(1);
  }
}

// Get token from command line argument
const token = process.argv[2];

if (!token) {
  console.error('\n❌ Usage: npx tsx src/utils/verify-token.ts YOUR_TOKEN_HERE');
  console.error('\nTo get your token:');
  console.error('  1. Open browser DevTools (F12)');
  console.error('  2. Go to Application/Storage > Local Storage');
  console.error('  3. Copy the value of "token" or "auth_token"');
  console.error('  4. Run: npx tsx src/utils/verify-token.ts <paste-token-here>\n');
  process.exit(1);
}

verifyAndDecodeToken(token);
