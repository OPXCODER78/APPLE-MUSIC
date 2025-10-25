#!/usr/bin/env node

/**
 * Supabase Setup Script
 * Automatically creates database tables and storage buckets
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acusjpzhvckglwoizelg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXNqcHpodmNrZ2x3b2l6ZWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzA4ODEsImV4cCI6MjA3NjYwNjg4MX0.OQXMK7uyM2YKiuIxOVaEPiQhA6dOJXQB-SfN3HxOWcM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  console.log('🚀 Starting Supabase setup...\n');

  try {
    // Test connection
    console.log('📡 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('songs')
      .select('count', { count: 'exact', head: true });
    
    if (testError && testError.code === '42P01') {
      console.log('⚠️  Songs table does not exist. Please run the SQL script manually.');
      console.log('\n📝 Instructions:');
      console.log('1. Go to: https://acusjpzhvckglwoizelg.supabase.co/project/_/sql');
      console.log('2. Open the file: /app/supabase-setup.sql');
      console.log('3. Copy and paste the SQL content');
      console.log('4. Click "RUN" to execute\n');
      return;
    }

    console.log('✅ Supabase connection successful!\n');

    // Check if songs table exists and has data
    const { count, error: countError } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error checking songs table:', countError.message);
    } else {
      console.log(`✅ Songs table exists with ${count || 0} songs\n`);
    }

    // Test storage buckets
    console.log('🗄️  Checking storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.log('⚠️  Could not list buckets:', bucketsError.message);
    } else {
      const songsBucket = buckets.find(b => b.name === 'songs');
      const thumbnailsBucket = buckets.find(b => b.name === 'thumbnails');

      if (songsBucket) {
        console.log('✅ Songs bucket exists');
      } else {
        console.log('⚠️  Songs bucket not found - please create it manually');
      }

      if (thumbnailsBucket) {
        console.log('✅ Thumbnails bucket exists');
      } else {
        console.log('⚠️  Thumbnails bucket not found - please create it manually');
      }
    }

    console.log('\n✨ Setup verification complete!');
    console.log('\n📌 Next steps:');
    console.log('1. Start the app: npm run dev');
    console.log('2. Visit admin panel: http://localhost:3000/admin');
    console.log('3. Login with password: admin123');
    console.log('4. Upload your first song!\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📝 Manual setup required:');
    console.log('Please run the SQL script at /app/supabase-setup.sql in your Supabase dashboard');
  }
}

setupDatabase();
