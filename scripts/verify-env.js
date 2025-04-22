import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the root directory
const rootDir = resolve(__dirname, '..');

// Path to the .env file
const envPath = resolve(rootDir, '.env');

console.log('Checking environment configuration...');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log(`✅ .env file found at: ${envPath}`);
  
  // Read the .env file content
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n').filter(line => 
    line.trim() && !line.startsWith('#')
  );
  
  console.log(`✅ .env file contains ${envLines.length} non-comment lines`);
  
  // Load environment variables
  dotenv.config({ path: envPath });
  
  // Check Supabase environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  console.log('Supabase URL:', supabaseUrl ? '✅ Defined' : '❌ Not defined');
  console.log('Supabase Key:', supabaseKey ? '✅ Defined' : '❌ Not defined');
  
  if (supabaseUrl && supabaseKey) {
    console.log('✅ All required Supabase environment variables are defined');
  } else {
    console.log('❌ Some Supabase environment variables are missing');
  }
} else {
  console.log(`❌ .env file not found at: ${envPath}`);
  console.log('Please create a .env file with the required environment variables.');
}

// Check Node.js version
console.log(`Node.js version: ${process.version}`);

// Check if we're using ESM
console.log(`Using ESM: ${typeof import.meta !== 'undefined' ? '✅ Yes' : '❌ No'}`);

console.log('Environment check completed.');
