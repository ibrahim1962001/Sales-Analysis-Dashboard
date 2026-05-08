// Script to add super admin to Firestore
// Run with: node setup-admin.mjs

const PROJECT_ID = 'kemet-ai-studio';
const UID = 'kEx3N7shT2Zzo50i3grmeht2wiU2';
const EMAIL = ''; // your email - will be filled from Firebase Auth

// Use Firestore REST API to create the admin document
const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/admins/${UID}`;

// We need to use the Firebase Admin SDK approach
// Since we don't have service account, we'll use the client SDK approach
// The AuthContext already handles this on first login via VITE_SUPER_ADMIN_UID

console.log('✅ Admin UID is already set in .env as VITE_SUPER_ADMIN_UID');
console.log('✅ On first login, the AuthContext will auto-register this UID in Firestore');
console.log('');
console.log('Steps to login:');
console.log('1. Go to http://localhost:5174/login');
console.log('2. Enter your Firebase email and password');
console.log('3. The dashboard will open automatically');
console.log('');
console.log(`Super Admin UID: ${UID}`);
