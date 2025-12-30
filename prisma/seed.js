// Database Seed Script
// Run with: npm run db:seed

const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPasswordHash = await argon2.hash('Admin@123!', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@civislaw.in' },
    update: {},
    create: {
      email: 'admin@civislaw.in',
      passwordHash: adminPasswordHash,
      fullName: 'System Administrator',
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
      preferences: JSON.stringify({
        notifications: true,
        emailAlerts: true,
        theme: 'light',
        fontSize: 'medium',
      }),
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test citizen user
  const citizenPasswordHash = await argon2.hash('Citizen@123!', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  });

  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@test.com' },
    update: {},
    create: {
      email: 'citizen@test.com',
      passwordHash: citizenPasswordHash,
      fullName: 'Test Citizen',
      role: 'CITIZEN',
      isActive: true,
      isVerified: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
    },
  });
  console.log('✅ Test citizen created:', citizen.email);

  // Create test NGO user
  const ngoPasswordHash = await argon2.hash('NGO@123!', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  });

  const ngoUser = await prisma.user.upsert({
    where: { email: 'ngo@test.com' },
    update: {},
    create: {
      email: 'ngo@test.com',
      passwordHash: ngoPasswordHash,
      fullName: 'Test NGO User',
      role: 'NGO',
      isActive: true,
      isVerified: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
    },
  });

  // Create NGO profile for the NGO user
  await prisma.nGOProfile.upsert({
    where: { userId: ngoUser.id },
    update: {},
    create: {
      userId: ngoUser.id,
      organizationName: 'Test Legal Aid NGO',
      registrationNumber: 'REG123456',
      region: 'Maharashtra',
      districts: 'Mumbai,Pune,Nagpur',
      isVerified: true,
    },
  });
  console.log('✅ Test NGO created:', ngoUser.email);

  // Create test victim user
  const victimPasswordHash = await argon2.hash('Victim@123!', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  });

  const victimUser = await prisma.user.upsert({
    where: { email: 'victim@test.com' },
    update: {},
    create: {
      email: 'victim@test.com',
      passwordHash: victimPasswordHash,
      fullName: 'Test Victim',
      role: 'VICTIM',
      isActive: true,
      isVerified: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
    },
  });
  console.log('✅ Test victim created:', victimUser.email);

  // Create test legal aid user
  const legalAidPasswordHash = await argon2.hash('LegalAid@123!', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  });

  const legalAidUser = await prisma.user.upsert({
    where: { email: 'legalaid@test.com' },
    update: {},
    create: {
      email: 'legalaid@test.com',
      passwordHash: legalAidPasswordHash,
      fullName: 'Test Legal Aid',
      role: 'LEGAL_AID',
      isActive: true,
      isVerified: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
    },
  });
  console.log('✅ Test legal aid created:', legalAidUser.email);

  // Create system configuration
  const configs = [
    {
      key: 'maintenance_mode',
      value: JSON.stringify({ enabled: false, message: '' }),
      description: 'System maintenance mode settings',
    },
    {
      key: 'registration_enabled',
      value: JSON.stringify({ allowed: true, requireVerification: true }),
      description: 'User registration settings',
    },
    {
      key: 'max_file_size_mb',
      value: JSON.stringify({ value: 50 }),
      description: 'Maximum file upload size in MB',
    },
    {
      key: 'supported_languages',
      value: JSON.stringify({ languages: ['en', 'hi', 'ta', 'bn', 'mr', 'gu'] }),
      description: 'Supported application languages',
    },
    {
      key: 'session_config',
      value: JSON.stringify({ sessionExpiry: '7d', refreshExpiry: '30d' }),
      description: 'Session configuration',
    },
  ];

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    });
  }
  console.log('✅ System configuration created');

  // Create initial announcement
  await prisma.announcement.upsert({
    where: { id: 'welcome-2024' },
    update: {},
    create: {
      id: 'welcome-2024',
      title: 'Welcome to CivisLaw',
      message: 'Welcome to CivisLaw - Your citizen-first judicial understanding platform. Start exploring legal documents, recording statements, and connecting with legal aid organizations.',
      type: 'FEATURE',
      priority: 1,
      targetRoles: 'CITIZEN,VICTIM,NGO,LEGAL_AID',
      startsAt: new Date(),
      isActive: true,
    },
  });
  console.log('✅ Welcome announcement created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Demo Accounts for Testing:');
  console.log('┌─────────────────────────────────────────────────────────┐');
  console.log('│ Role          │ Email                    │ Password    │');
  console.log('├─────────────────────────────────────────────────────────┤');
  console.log('│ 👤 Citizen    │ citizen@test.com         │ Victim@123! │');
  console.log('│ 🎗️ Victim     │ victim@test.com          │ Victim@123! │');
  console.log('│ 🤝 NGO        │ ngo@test.com             │ NGO@123!    │');
  console.log('│ ⚖️ Legal Aid  │ legalaid@test.com       │ LegalAid@123! │');
  console.log('│ 🛡️ Admin      │ admin@civislaw.in        │ Admin@123!  │');
  console.log('└─────────────────────────────────────────────────────────┘');
  console.log('\n💡 Tip: Use these accounts to test different platform features!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
