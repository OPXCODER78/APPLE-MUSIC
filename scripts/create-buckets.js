#!/usr/bin/env node

/**
 * Create Storage Buckets Script
 * Creates the required storage buckets for songs and thumbnails
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://acusjpzhvckglwoizelg.supabase.co';
// Note: For bucket creation, you need the service role key, not anon key
// Using anon key for now - buckets should be created via dashboard
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdXNqcHpodmNrZ2x3b2l6ZWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzA4ODEsImV4cCI6MjA3NjYwNjg4MX0.OQXMK7uyM2YKiuIxOVaEPiQhA6dOJXQB-SfN3HxOWcM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBuckets() {
  console.log('🗄️  Creating storage buckets...\n');

  try {
    // Try to create songs bucket
    const { data: songsBucket, error: songsError } = await supabase
      .storage
      .createBucket('songs', {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac']
      });

    if (songsError) {
      if (songsError.message.includes('already exists')) {
        console.log('✅ Songs bucket already exists');
      } else {
        console.log('⚠️  Songs bucket creation:', songsError.message);
      }
    } else {
      console.log('✅ Songs bucket created successfully');
    }

    // Try to create thumbnails bucket
    const { data: thumbsBucket, error: thumbsError } = await supabase
      .storage
      .createBucket('thumbnails', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      });

    if (thumbsError) {
      if (thumbsError.message.includes('already exists')) {
        console.log('✅ Thumbnails bucket already exists');
      } else {
        console.log('⚠️  Thumbnails bucket creation:', thumbsError.message);
      }
    } else {
      console.log('✅ Thumbnails bucket created successfully');
    }

    console.log('\n✨ Storage setup complete!\n');
    
    // Verify buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (!listError && buckets) {
      console.log('📦 Available buckets:');
      buckets.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Note: Storage buckets may need to be created manually in Supabase Dashboard');
    console.log('Go to: Storage -> New Bucket');
    console.log('Create two buckets: "songs" and "thumbnails" (both public)');
  }
}

createBuckets();
