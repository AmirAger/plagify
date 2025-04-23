import { NextResponse } from 'next/server';
import { query } from '@/utils/database';

export async function GET() {
  try {
    // Create a test table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        file_path VARCHAR(255),
        user_id UUID NOT NULL,
        similarity_score FLOAT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create a test table for plagiarism results
    await query(`
      CREATE TABLE IF NOT EXISTS plagiarism_results (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        comparison_document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        similarity_score FLOAT NOT NULL,
        matched_segments JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully'
    });
  } catch (error: any) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database setup failed',
      error: error.message
    }, { status: 500 });
  }
}