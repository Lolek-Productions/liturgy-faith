#!/bin/bash

# Database Documentation Generator for Liturgy Faith
# 
# This script generates database documentation by extracting information from 
# Supabase's REST API and writing it to DATABASE.md. The file is completely 
# rewritten each time the script runs.
#
# FEATURES:
# - Dynamically discovers tables from Supabase REST API
# - Loads environment variables from .env.local automatically
# - Shows table accessibility status from live database
# - Sets output file to read-only to prevent accidental edits
# - Lightweight - only requires curl, no database client tools needed
#
# REQUIREMENTS:
# - Environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
# - curl command (standard on most systems)
#
# USAGE:
#   ./scripts/generate-database-docs.sh
#
# The script will:
# 1. Load environment variables from .env.local
# 2. Fetch actual table list from Supabase REST API
# 3. Check accessibility of each discovered table
# 5. Generate DATABASE.md with complete documentation
#
# SECURITY:
# - Only uses public API endpoints with anon key
# - No database credentials required
# - Read-only operations only

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[NOTE]${NC} $1"
}

print_status "Database Documentation Generator for Liturgy Faith"
print_status "================================================="

# Load environment variables from .env.local if it exists
if [ -f ".env.local" ]; then
    print_status "Loading environment variables from .env.local"
    export $(grep -v '^#' .env.local | xargs)
elif [ -f "../.env.local" ]; then
    print_status "Loading environment variables from ../.env.local"
    export $(grep -v '^#' ../.env.local | xargs)
fi

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    print_error "Missing required environment variables:"
    print_error "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set"
    print_error "Please check your .env.local file exists and contains these variables"
    exit 1
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    print_error "curl command not found. Please install curl."
    exit 1
fi

# Create output file
OUTPUT_FILE="DATABASE.md"
print_status "Will generate documentation in: $OUTPUT_FILE"
print_info "Using Supabase REST API for documentation"

# Generate the documentation header
print_status "Generating documentation..."

cat > "$OUTPUT_FILE" << 'EOF'
# Database Schema Documentation

This document provides comprehensive documentation of the database schema for the Liturgy Faith application.

*Generated automatically - do not edit manually*

EOF

# Add generation timestamp and method
echo "**Generated on:** $(date)" >> "$OUTPUT_FILE"
echo "**Method:** Supabase REST API" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Add database overview
cat >> "$OUTPUT_FILE" << 'EOF'
## Database Overview

This PostgreSQL database supports a liturgical management application with the following main components:

- **Authentication**: User management via Supabase Auth
- **Petitions**: Liturgical petition management with context templates
- **Settings**: User preferences and petition templates
- **Ministers**: Clergy and ministry team management
- **Liturgy Planning**: Liturgical calendar and planning tools
- **Readings**: Scripture reading management and collections

EOF

# Generate documentation using Supabase API
print_status "Generating documentation using Supabase API..."

echo "## Tables Overview" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "The following tables are available in the database:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Get actual table list from Supabase information_schema
print_status "Fetching table list from information_schema..."
TABLES_RESPONSE=$(curl -s -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/information_schema.tables?select=table_name&table_schema=eq.public&table_type=eq.BASE%20TABLE" 2>/dev/null || echo "")

# Extract table names from the response
TABLES_FROM_API=""
if [ ! -z "$TABLES_RESPONSE" ] && ! echo "$TABLES_RESPONSE" | grep -q "error" && [ "$TABLES_RESPONSE" != "[]" ]; then
    if command -v jq &> /dev/null; then
        TABLES_FROM_API=$(echo "$TABLES_RESPONSE" | jq -r '.[].table_name' 2>/dev/null | sort || echo "")
    else
        # Fallback parsing without jq
        TABLES_FROM_API=$(echo "$TABLES_RESPONSE" | grep -o '"table_name":"[^"]*"' | sed 's/"table_name":"//g' | sed 's/"//g' | sort || echo "")
    fi
fi

if [ -z "$TABLES_FROM_API" ]; then
    print_warning "Could not fetch table list from information_schema, trying fallback method..."
    # Fallback: try OpenAPI endpoint
    OPENAPI_RESPONSE=$(curl -s -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/" 2>/dev/null || echo "")
    TABLES_FROM_API=$(echo "$OPENAPI_RESPONSE" | grep -o '"/[^"]*"' | grep -v '/rpc/' | sed 's/"//g' | sed 's/\///g' | sort -u | grep -v '^$' | grep -v '^root$' | grep -v '^health$' || echo "")
fi

if [ -z "$TABLES_FROM_API" ]; then
    print_error "Could not fetch table list from API"
    echo "*Unable to fetch table information from API.*" >> "$OUTPUT_FILE"
else
    print_status "Found tables from API, analyzing schema..."
    
    echo "## Table Schemas" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    for table in $TABLES_FROM_API; do
        if [ ! -z "$table" ] && [ "$table" != "root" ] && [ "$table" != "health" ]; then
            print_status "Analyzing table: $table"
            
            # Get schema information from OpenAPI definitions
            OPENAPI_FULL_RESPONSE=$(curl -s -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/" 2>/dev/null || echo "")
            SCHEMA_RESPONSE=$(echo "$OPENAPI_FULL_RESPONSE" | jq ".definitions.${table}.properties // {}" 2>/dev/null || echo "{}")
            
            # Check if we can access the table for basic info
            TABLE_CHECK=$(curl -s -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=*&limit=0" 2>/dev/null || echo "")
            
            if echo "$TABLE_CHECK" | grep -q "error"; then
                print_status "Table $table: not accessible (likely RLS protected)"
                echo "### Table: \`$table\`" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                echo "*Table is protected by Row Level Security (RLS) and not accessible via API.*" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                echo "---" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
            else
                echo "### Table: \`$table\`" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
                
                # Parse schema information
                if [ ! -z "$SCHEMA_RESPONSE" ] && [ "$SCHEMA_RESPONSE" != "{}" ] && [ "$SCHEMA_RESPONSE" != "null" ]; then
                    echo "**Column Schema:**" >> "$OUTPUT_FILE"
                    echo "" >> "$OUTPUT_FILE"
                    echo "| Column | Type | Nullable | Default |" >> "$OUTPUT_FILE"
                    echo "|--------|------|----------|---------|" >> "$OUTPUT_FILE"
                    
                    if command -v jq &> /dev/null; then
                        # Parse OpenAPI schema with jq
                        echo "$SCHEMA_RESPONSE" | jq -r 'to_entries[] | "| `" + .key + "` | " + (.value.format // .value.type // "unknown") + " | " + (if .value.default then "NO" else "YES" end) + " | " + (.value.default // "none") + " |"' 2>/dev/null | sort -u >> "$OUTPUT_FILE" || {
                            print_warning "Could not parse OpenAPI schema with jq, trying fallback..."
                            # Fallback parsing for OpenAPI format
                            COLUMN_NAMES=$(echo "$SCHEMA_RESPONSE" | jq -r 'keys[]' 2>/dev/null | sort || echo "")
                            for col in $COLUMN_NAMES; do
                                if [ ! -z "$col" ]; then
                                    TYPE_INFO=$(echo "$SCHEMA_RESPONSE" | jq -r ".\"$col\".format // .\"$col\".type // \"unknown\"" 2>/dev/null || echo "unknown")
                                    DEFAULT_INFO=$(echo "$SCHEMA_RESPONSE" | jq -r ".\"$col\".default // \"none\"" 2>/dev/null || echo "none")
                                    
                                    # Determine nullable based on presence of default or description
                                    NULLABLE="YES"
                                    if [ "$DEFAULT_INFO" != "none" ] && [ "$DEFAULT_INFO" != "null" ]; then
                                        NULLABLE="NO"
                                    fi
                                    
                                    echo "| \`$col\` | $TYPE_INFO | $NULLABLE | $DEFAULT_INFO |" >> "$OUTPUT_FILE"
                                fi
                            done
                        }
                    else
                        # Fallback parsing without jq for OpenAPI format
                        print_warning "jq not available, using basic parsing for OpenAPI schema..."
                        COLUMN_NAMES=$(echo "$SCHEMA_RESPONSE" | grep -o '"[^"]*":{' | sed 's/"//g' | sed 's/:{//g' | sort || echo "")
                        for col in $COLUMN_NAMES; do
                            if [ ! -z "$col" ]; then
                                # Extract basic type information
                                TYPE_INFO=$(echo "$SCHEMA_RESPONSE" | grep -A10 "\"$col\":{" | grep -o '"format":"[^"]*"' | sed 's/"format":"//g' | sed 's/"//g' | head -1)
                                if [ -z "$TYPE_INFO" ]; then
                                    TYPE_INFO=$(echo "$SCHEMA_RESPONSE" | grep -A10 "\"$col\":{" | grep -o '"type":"[^"]*"' | sed 's/"type":"//g' | sed 's/"//g' | head -1)
                                fi
                                DEFAULT_INFO=$(echo "$SCHEMA_RESPONSE" | grep -A10 "\"$col\":{" | grep -o '"default":"[^"]*"' | sed 's/"default":"//g' | sed 's/"//g' | head -1)
                                
                                TYPE_DISPLAY="${TYPE_INFO:-unknown}"
                                DEFAULT_DISPLAY="${DEFAULT_INFO:-none}"
                                NULLABLE_DISPLAY="YES"
                                if [ "$DEFAULT_DISPLAY" != "none" ]; then
                                    NULLABLE_DISPLAY="NO"
                                fi
                                
                                echo "| \`$col\` | $TYPE_DISPLAY | $NULLABLE_DISPLAY | $DEFAULT_DISPLAY |" >> "$OUTPUT_FILE"
                            fi
                        done
                    fi
                else
                    # Try to get column names from a sample query
                    SAMPLE_RESPONSE=$(curl -s -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?select=*&limit=1" 2>/dev/null || echo "")
                    
                    if [ "$SAMPLE_RESPONSE" != "[]" ] && ! echo "$SAMPLE_RESPONSE" | grep -q "error"; then
                        echo "**Columns (from sample data):**" >> "$OUTPUT_FILE"
                        echo "" >> "$OUTPUT_FILE"
                        
                        if command -v jq &> /dev/null; then
                            FIELDS=$(echo "$SAMPLE_RESPONSE" | jq -r '.[0] // {} | keys[]' 2>/dev/null | sort || echo "")
                            for field in $FIELDS; do
                                echo "- \`$field\`" >> "$OUTPUT_FILE"
                            done
                        else
                            # Fallback without jq
                            FIELDS=$(echo "$SAMPLE_RESPONSE" | grep -o '"[^"]*":' | sed 's/"//g' | sed 's/://g' | sort -u || echo "")
                            for field in $FIELDS; do
                                echo "- \`$field\`" >> "$OUTPUT_FILE"
                            done
                        fi
                    else
                        echo "*Table accessible but no schema or data available.*" >> "$OUTPUT_FILE"
                    fi
                fi
                
                echo "" >> "$OUTPUT_FILE"
                echo "---" >> "$OUTPUT_FILE"
                echo "" >> "$OUTPUT_FILE"
            fi
        fi
    done
fi

# Note: Migration history removed - focusing only on current live schema

# Add footer
cat >> "$OUTPUT_FILE" << 'EOF'
## Security

- All tables implement Row Level Security (RLS)
- Users can only access their own data via `user_id` filtering
- Policies enforce proper data isolation between users

## Data Types

- Primary keys: UUID with `uuid_generate_v4()` defaults
- Timestamps: `timestamp with time zone` using UTC
- JSON data: `jsonb` columns for flexible data storage
- Text fields: Various `text` columns for content

---

## Notes

- This documentation is automatically generated from the live database
- All tables use UUID primary keys with `uuid_generate_v4()` defaults
- Row Level Security (RLS) is enabled on user-facing tables
- Foreign key relationships enforce referential integrity
- Timestamps use `timezone('utc'::text, now())` for consistency

For more information about the database structure, see the migration files in `supabase/migrations/`.

EOF

print_status "Database documentation generated successfully!"
print_status "Output written to: $OUTPUT_FILE"

# Make the generated file read-only to prevent accidental edits
chmod 444 "$OUTPUT_FILE"
print_warning "File set to read-only to prevent accidental modifications"
print_warning "To regenerate, run this script again"