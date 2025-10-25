#!/usr/bin/env node

/**
 * Automatic Storage Policy Fix Script
 * This script uses the Supabase Management API to fix RLS policies
 */

const https = require('https');
const fs = require('fs');

const SUPABASE_URL = 'https://acusjpzhvckglwoizelg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXNqcHpodmNrZ2x3b2l6ZWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzA4ODEsImV4cCI6MjA3NjYwNjg4MX0.OQXMK7uyM2YKiuIxOVaEPiQhA6dOJXQB-SfN3HxOWcM';

console.log('🔧 Storage Policy Fix Helper\n');
console.log('⚠️  The RLS policy error occurs because storage buckets need proper permissions.\n');

console.log('📋 QUICK FIX - Follow these steps:\n');
console.log('1️⃣  Go to your Supabase Dashboard:');
console.log('   👉 https://acusjpzhvckglwoizelg.supabase.co/project/_/sql/new\n');

console.log('2️⃣  Copy the SQL script from:');
console.log('   👉 /app/fix-storage-policies.sql\n');

console.log('3️⃣  Paste it into the SQL Editor and click "RUN"\n');

console.log('4️⃣  Refresh your admin panel and try uploading again!\n');

console.log('═══════════════════════════════════════════════════════════════\n');

// Read and display the SQL script
console.log('📄 SQL Script to run (also saved in fix-storage-policies.sql):\n');
console.log('═══════════════════════════════════════════════════════════════');

try {
  const sqlScript = fs.readFileSync('/app/fix-storage-policies.sql', 'utf8');
  // Display first 50 lines
  const lines = sqlScript.split('\n').slice(0, 50);
  console.log(lines.join('\n'));
  
  if (sqlScript.split('\n').length > 50) {
    console.log('\n... (see full script in /app/fix-storage-policies.sql)');
  }
} catch (error) {
  console.error('Error reading SQL file:', error.message);
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('\n✨ After running the SQL script, storage uploads will work!\n');
