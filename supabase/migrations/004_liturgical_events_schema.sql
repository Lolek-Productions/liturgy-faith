-- Liturgical Events Module Schema
-- This migration creates the comprehensive liturgical events system with
-- groups, people/servants, ministries, templates, and events

-- People/Servants table
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  availability JSONB, -- Store availability as JSON (days, times, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Group membership (many-to-many between people and groups)
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE NOT NULL,
  role TEXT, -- Optional role within the group (leader, member, etc.)
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(group_id, person_id)
);

-- Ministries table
CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  requirements TEXT, -- Special requirements or qualifications
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Liturgical Event Templates
CREATE TABLE IF NOT EXISTS liturgical_event_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL, -- Store template structure as JSON
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enhanced Liturgical Events table (replacing the existing simple one)
DROP TABLE IF EXISTS liturgical_events CASCADE;
CREATE TABLE liturgical_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  template_id UUID REFERENCES liturgical_event_templates(id) ON DELETE SET NULL,
  liturgical_readings_id UUID REFERENCES liturgical_readings(id) ON DELETE SET NULL,
  petitions_id UUID REFERENCES petitions(id) ON DELETE SET NULL,
  notes TEXT,
  status TEXT DEFAULT 'draft', -- draft, planned, in_progress, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Event Ministry Assignments (many-to-many between events and ministries)
CREATE TABLE IF NOT EXISTS event_ministry_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES liturgical_events(id) ON DELETE CASCADE NOT NULL,
  ministry_id UUID REFERENCES ministries(id) ON DELETE CASCADE NOT NULL,
  required_count INTEGER DEFAULT 1, -- How many people needed for this ministry
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Event Role Assignments (assigns people or groups to specific ministry roles in events)
CREATE TABLE IF NOT EXISTS event_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_ministry_assignment_id UUID REFERENCES event_ministry_assignments(id) ON DELETE CASCADE NOT NULL,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  role_notes TEXT,
  confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  -- Ensure either person_id OR group_id is set, but not both
  CONSTRAINT check_person_or_group CHECK (
    (person_id IS NOT NULL AND group_id IS NULL) OR 
    (person_id IS NULL AND group_id IS NOT NULL)
  )
);

-- RLS (Row Level Security) Policies
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE liturgical_event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE liturgical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_ministry_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_role_assignments ENABLE ROW LEVEL SECURITY;

-- People policies
CREATE POLICY "Users can view their own people" ON people
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own people" ON people
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own people" ON people
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own people" ON people
  FOR DELETE USING (user_id = auth.uid());

-- Groups policies
CREATE POLICY "Users can view their own groups" ON groups
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own groups" ON groups
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own groups" ON groups
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own groups" ON groups
  FOR DELETE USING (user_id = auth.uid());

-- Group members policies (access through group ownership)
CREATE POLICY "Users can view group members for their groups" ON group_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM groups WHERE groups.id = group_members.group_id AND groups.user_id = auth.uid())
  );
CREATE POLICY "Users can insert group members for their groups" ON group_members
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM groups WHERE groups.id = group_members.group_id AND groups.user_id = auth.uid())
  );
CREATE POLICY "Users can update group members for their groups" ON group_members
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM groups WHERE groups.id = group_members.group_id AND groups.user_id = auth.uid())
  );
CREATE POLICY "Users can delete group members for their groups" ON group_members
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM groups WHERE groups.id = group_members.group_id AND groups.user_id = auth.uid())
  );

-- Ministries policies
CREATE POLICY "Users can view their own ministries" ON ministries
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own ministries" ON ministries
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own ministries" ON ministries
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own ministries" ON ministries
  FOR DELETE USING (user_id = auth.uid());

-- Liturgical event templates policies
CREATE POLICY "Users can view their own templates" ON liturgical_event_templates
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own templates" ON liturgical_event_templates
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own templates" ON liturgical_event_templates
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own templates" ON liturgical_event_templates
  FOR DELETE USING (user_id = auth.uid());

-- Liturgical events policies
CREATE POLICY "Users can view their own events" ON liturgical_events
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own events" ON liturgical_events
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own events" ON liturgical_events
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own events" ON liturgical_events
  FOR DELETE USING (user_id = auth.uid());

-- Event ministry assignments policies (access through event ownership)
CREATE POLICY "Users can view assignments for their events" ON event_ministry_assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM liturgical_events WHERE liturgical_events.id = event_ministry_assignments.event_id AND liturgical_events.user_id = auth.uid())
  );
CREATE POLICY "Users can insert assignments for their events" ON event_ministry_assignments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM liturgical_events WHERE liturgical_events.id = event_ministry_assignments.event_id AND liturgical_events.user_id = auth.uid())
  );
CREATE POLICY "Users can update assignments for their events" ON event_ministry_assignments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM liturgical_events WHERE liturgical_events.id = event_ministry_assignments.event_id AND liturgical_events.user_id = auth.uid())
  );
CREATE POLICY "Users can delete assignments for their events" ON event_ministry_assignments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM liturgical_events WHERE liturgical_events.id = event_ministry_assignments.event_id AND liturgical_events.user_id = auth.uid())
  );

-- Event role assignments policies (access through event ownership)
CREATE POLICY "Users can view role assignments for their events" ON event_role_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM event_ministry_assignments 
      JOIN liturgical_events ON liturgical_events.id = event_ministry_assignments.event_id 
      WHERE event_ministry_assignments.id = event_role_assignments.event_ministry_assignment_id 
      AND liturgical_events.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert role assignments for their events" ON event_role_assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_ministry_assignments 
      JOIN liturgical_events ON liturgical_events.id = event_ministry_assignments.event_id 
      WHERE event_ministry_assignments.id = event_role_assignments.event_ministry_assignment_id 
      AND liturgical_events.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update role assignments for their events" ON event_role_assignments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM event_ministry_assignments 
      JOIN liturgical_events ON liturgical_events.id = event_ministry_assignments.event_id 
      WHERE event_ministry_assignments.id = event_role_assignments.event_ministry_assignment_id 
      AND liturgical_events.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete role assignments for their events" ON event_role_assignments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM event_ministry_assignments 
      JOIN liturgical_events ON liturgical_events.id = event_ministry_assignments.event_id 
      WHERE event_ministry_assignments.id = event_role_assignments.event_ministry_assignment_id 
      AND liturgical_events.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_people_user_id ON people(user_id);
CREATE INDEX idx_people_active ON people(is_active) WHERE is_active = true;
CREATE INDEX idx_groups_user_id ON groups(user_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_person_id ON group_members(person_id);
CREATE INDEX idx_ministries_user_id ON ministries(user_id);
CREATE INDEX idx_ministries_sort_order ON ministries(sort_order);
CREATE INDEX idx_liturgical_event_templates_user_id ON liturgical_event_templates(user_id);
CREATE INDEX idx_liturgical_events_user_id ON liturgical_events(user_id);
CREATE INDEX idx_liturgical_events_date ON liturgical_events(event_date);
CREATE INDEX idx_event_ministry_assignments_event_id ON event_ministry_assignments(event_id);
CREATE INDEX idx_event_role_assignments_assignment_id ON event_role_assignments(event_ministry_assignment_id);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ministries_updated_at BEFORE UPDATE ON ministries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liturgical_event_templates_updated_at BEFORE UPDATE ON liturgical_event_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_liturgical_events_updated_at BEFORE UPDATE ON liturgical_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_role_assignments_updated_at BEFORE UPDATE ON event_role_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default ministries as examples
INSERT INTO ministries (user_id, name, description, requirements, sort_order) VALUES
  -- Note: These will be inserted with NULL user_id for now - users will need to create their own
  (NULL, 'Usher', 'Assists with seating, collection, and maintaining order during services', 'Friendly demeanor, punctuality', 1),
  (NULL, 'Extraordinary Eucharistic Minister', 'Assists with distribution of Holy Communion', 'Must be trained and commissioned by the parish', 2),
  (NULL, 'Server/Acolyte', 'Assists the priest during Mass with liturgical duties', 'Training required, usually children or young adults', 3),
  (NULL, 'Lector', 'Proclaims the Word of God during liturgical services', 'Clear speaking voice, comfort with public reading', 4),
  (NULL, 'Welcoming Ministry', 'Greets parishioners and visitors before and after services', 'Warm personality, knowledge of parish programs', 5),
  (NULL, 'Music Ministry', 'Provides musical leadership during liturgical celebrations', 'Musical ability, commitment to regular practice', 6),
  (NULL, 'Altar Server Coordinator', 'Coordinates and trains altar servers', 'Experience as altar server, leadership skills', 7),
  (NULL, 'Sacristan', 'Prepares liturgical items and maintains sacred space', 'Knowledge of liturgical requirements, attention to detail', 8);

-- Note: The NULL user_id ministries above are templates. In the application,
-- these should be copied to users when they first access the ministries section,
-- or they should create their own from scratch.