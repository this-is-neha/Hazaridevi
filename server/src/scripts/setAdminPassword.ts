/**
 * Change (or reset) an admin password from the command line.
 *
 *   npm run admin:password -- "NewStrongPassword123"            (user "admin")
 *   npm run admin:password -- "NewStrongPassword123" otheruser  (another admin; created if missing)
 *
 * Every existing admin login (token) stays valid until it expires, so log in again afterwards.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const [password, username = 'admin'] = process.argv.slice(2);

const fail = (msg: string) => {
  console.error(`❌ ${msg}`);
  process.exit(1);
};

if (!password) fail('Usage: npm run admin:password -- "NewStrongPassword123" [username]');
if (password.length < 10) fail('Password must be at least 10 characters.');
if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) fail('Password must contain letters and numbers.');

const prisma = new PrismaClient();

(async () => {
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  });
  console.log(`✅ Password updated for admin "${admin.username}". Log in again with the new password.`);
})()
  .catch((err) => fail(err.message))
  .finally(() => prisma.$disconnect());
