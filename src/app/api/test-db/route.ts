import { NextResponse } from 'next/server';
import { query } from '@/utils/database';
import { supabase } from '@/utils/supabase';

export async function GET() {
  try {
    // Test direct PostgreSQL connection
    const pgResult = await query('SELECT NOW() as time');
    
    // Test Supabase connection
    let supabaseData = null;
    let error = null;
    
    try {
      const response = await supabase
        .from('_test')
        .select('*')
        .limit(1);
        
      supabaseData = response.data;
      error = response.error;
    } catch (err: any) {
      error = { message: err.message };
    }

    return NextResponse.json({
      success: true,
      message: 'Database connections tested',
      pgTime: pgResult.rows[0]?.time || null,
      supabaseStatus: error ? 'Error' : 'Connected',
      supabaseError: error ? error.message : null,
      supabaseData: supabaseData || []
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection test failed',
      error: error.message
    }, { status: 500 });
  }
}