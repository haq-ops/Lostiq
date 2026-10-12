// Usage (from the server/ folder): node scripts/testEmail.js someone@example.com
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sendMatchEmail, verifyEmailConnection } = require('../utils/emailService');

const to = process.argv[2];
if (!to) {
  console.error('Usage: node scripts/testEmail.js <recipient-email>');
  process.exit(1);
}

(async () => {
  await verifyEmailConnection();

  const foundItem = {
    _id: 'test123',
    title: 'Test Found Wallet',
    category: 'wallet',
    location: { city: 'Colombo' },
    date: new Date()
  };
  const lostItem = { title: 'Test Lost Wallet', category: 'wallet' };

  try {
    await sendMatchEmail(to, 'Test User', foundItem, lostItem);
    console.log('Done. Check the inbox (and spam folder).');
  } catch {
    process.exitCode = 1; // error details already logged above
  }
})();
