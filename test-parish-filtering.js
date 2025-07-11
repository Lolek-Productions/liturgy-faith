/**
 * Test script to verify parish filtering is working
 * 
 * This script helps test the parish filtering system by:
 * 1. Creating test data
 * 2. Testing RLS policies
 * 3. Verifying JWT claims
 * 4. Testing parish switching
 */

// Run this in your browser console or create a test API endpoint

async function testParishFiltering() {
  console.log('🧪 Testing Parish Filtering System...\n');
  
  try {
    // 1. Test JWT claims functions
    console.log('1. Testing JWT Claims Functions:');
    
    // This would be in your app's JavaScript
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test getting selected parish ID
    const { data: claims } = await supabase.rpc('get_user_claims');
    console.log('   Current JWT claims:', claims);
    
    // Test RLS helper functions
    const { data: selectedParish } = await supabase.rpc('get_selected_parish_id');
    console.log('   Selected parish ID:', selectedParish);
    
    // 2. Test data access (should be filtered by parish)
    console.log('\n2. Testing Data Access:');
    
    const { data: petitions } = await supabase.from('petitions').select('*');
    console.log('   Petitions count:', petitions?.length || 0);
    
    const { data: categories } = await supabase.from('categories').select('*');
    console.log('   Categories count:', categories?.length || 0);
    
    const { data: groups } = await supabase.from('groups').select('*');
    console.log('   Groups count:', groups?.length || 0);
    
    // 3. Test creating data (should automatically get parish_id)
    console.log('\n3. Testing Data Creation:');
    
    const { data: newCategory, error: categoryError } = await supabase
      .from('categories')
      .insert([{ name: 'Test Category', description: 'Test description' }])
      .select()
      .single();
    
    if (categoryError) {
      console.error('   Category creation error:', categoryError);
    } else {
      console.log('   Created category:', newCategory);
      console.log('   Category parish_id:', newCategory.parish_id);
    }
    
    // 4. Test parish switching
    console.log('\n4. Testing Parish Switching:');
    
    // Get user's parish associations
    const { data: userParishes } = await supabase
      .from('parish_user')
      .select('parish_id, parishes(name)')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
    
    console.log('   User parishes:', userParishes);
    
    // 5. Test user settings
    console.log('\n5. Testing User Settings:');
    
    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    
    console.log('   User settings:', userSettings);
    
    console.log('\n✅ Parish filtering test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Instructions for manual testing
console.log(`
📋 Manual Testing Instructions:

1. Open your browser's developer console on your app
2. Run: testParishFiltering()
3. Check the console output for results

Alternative testing in Supabase Dashboard:

1. Go to SQL Editor in Supabase Dashboard
2. Run these queries:

-- Check if you have a parish association
SELECT * FROM parish_user WHERE user_id = auth.uid();

-- Check your user settings
SELECT * FROM user_settings WHERE user_id = auth.uid();

-- Test RLS functions
SELECT get_selected_parish_id(), get_user_claims();

-- Test data access (should be filtered by parish)
SELECT COUNT(*) FROM petitions;
SELECT COUNT(*) FROM categories;

-- Create test data
INSERT INTO categories (name, description) VALUES ('Test Category', 'Test description');
SELECT * FROM categories ORDER BY created_at DESC LIMIT 1;

3. All queries should work and data should be filtered by your selected parish
`);

module.exports = { testParishFiltering };