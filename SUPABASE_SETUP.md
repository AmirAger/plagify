# Supabase Database Setup

This document provides information about the Supabase PostgreSQL database setup for the Plagify application.

## Configuration

The Supabase database is configured with the following credentials in the `.env.local` file:

```
# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL=https://whbfbtmebvdsbnbzqbav.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Connection (Supabase PostgreSQL)
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.whbfbtmebvdsbnbzqbav
DB_PASSWORD=CekTurnitinPG
```

## Database Structure

The application uses the following database tables:

1. **documents** - Stores information about uploaded documents
   - id: Primary key
   - title: Document title
   - content: Document text content
   - file_path: Path to the stored file
   - user_id: ID of the user who uploaded the document
   - similarity_score: Overall plagiarism score
   - created_at: Timestamp when the document was created
   - updated_at: Timestamp when the document was last updated

2. **plagiarism_results** - Stores plagiarism comparison results
   - id: Primary key
   - document_id: Reference to the main document
   - comparison_document_id: Reference to the document being compared
   - similarity_score: Similarity score between the documents
   - matched_segments: JSON data containing matched text segments
   - created_at: Timestamp when the comparison was performed

## API Endpoints

The application includes the following API endpoints for database operations:

- **/api/test-db** - Tests the database connection
- **/api/setup-db** - Creates the necessary database tables

## Utility Functions

Database operations are handled through utility functions in:

1. **src/utils/supabase.ts** - Supabase client for authentication and data access
2. **src/utils/database.ts** - Direct PostgreSQL connection for complex queries

## Authentication

Authentication is handled through NextAuth.js, which is configured to use Supabase's authentication service. The authentication flow is:

1. User submits login credentials on the login page
2. NextAuth.js sends the credentials to Supabase for verification
3. If valid, a session is created and the user is redirected to the dashboard

## Development Notes

- For local development, ensure all environment variables are properly set in `.env.local`
- To test database connectivity, visit `/api/test-db` in your browser
- To initialize the database tables, visit `/api/setup-db` in your browser