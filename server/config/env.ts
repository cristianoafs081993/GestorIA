import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the root directory
const rootDir = resolve(__dirname, '..', '..');

// Path to the .env file
const envPath = resolve(rootDir, '.env');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.warn('.env file not found. Using environment variables from the system.');
  dotenv.config();
}

// Export environment variables
export const env = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Log environment status (without revealing sensitive values)
console.log('Environment configuration loaded:');
console.log('- SUPABASE_URL:', env.SUPABASE_URL ? 'Defined' : 'Not defined');
console.log('- SUPABASE_ANON_KEY:', env.SUPABASE_ANON_KEY ? 'Defined' : 'Not defined');
console.log('- NODE_ENV:', env.NODE_ENV);
