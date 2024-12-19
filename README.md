# Impact Assessment Tool

## Vercel Deployment Prerequisites

1. Create a Supabase Project
2. Set up the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase Database Schema

Create two tables in your Supabase database:

#### organizations table
\`\`\`sql
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

#### assessments table
\`\`\`sql
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER REFERENCES organizations(id),
  lead_impact_consultant TEXT,
  research_consultant TEXT,
  data_consultant TEXT,
  alignment_score INTEGER,
  purpose_statement_length INTEGER,
  purpose_statement_common_words INTEGER,
  purpose_statement_uniqueness INTEGER,
  purpose_statement_clarity INTEGER,
  purpose_statement_focus INTEGER,
  impact_leadership INTEGER,
  impact_appetite INTEGER,
  impact_desire INTEGER,
  impact_culture INTEGER,
  impact_blockers INTEGER,
  impact_buy_in INTEGER,
  theory_of_change_completeness INTEGER,
  theory_of_change_use INTEGER,
  theory_of_change_willingness INTEGER,
  theory_of_change_simplicity INTEGER,
  theory_of_change_definitions INTEGER,
  measurement_framework_feasibility INTEGER,
  measurement_framework_indicators INTEGER,
  measurement_framework_outcomes INTEGER,
  measurement_framework_validation INTEGER,
  measurement_framework_comparison INTEGER,
  measurement_framework_demographics INTEGER,
  measurement_framework_segmentation INTEGER,
  data_structure INTEGER,
  data_uniqueness INTEGER,
  data_expertise INTEGER,
  data_completeness INTEGER,
  data_quality INTEGER,
  data_consistency INTEGER,
  data_effectiveness INTEGER,
  data_automaticity INTEGER,
  system_appropriate INTEGER,
  system_fitness INTEGER,
  system_personnel INTEGER,
  system_customization INTEGER,
  system_connectivity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

