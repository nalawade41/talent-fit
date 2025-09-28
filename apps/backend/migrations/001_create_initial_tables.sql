-- Migration: 001_create_initial_tables.sql
-- Description: Create all initial tables for the talent matching platform
-- Created: 2025-01-27

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Employee', 'Manager')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create index on deleted_at for soft deletes
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Create employee_profiles table
CREATE TABLE IF NOT EXISTS employee_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    geo VARCHAR(255),
    date_of_joining TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    notice_date TIMESTAMP WITH TIME ZONE,
    type VARCHAR(50) NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb,
    years_of_experience INTEGER DEFAULT 0,
    industry VARCHAR(255),
    availability_flag BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create index on deleted_at for soft deletes
CREATE INDEX IF NOT EXISTS idx_employee_profiles_deleted_at ON employee_profiles(deleted_at);

-- Create index on skills for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_employee_profiles_skills ON employee_profiles USING GIN(skills);

-- Create index on availability_flag for filtering
CREATE INDEX IF NOT EXISTS idx_employee_profiles_availability ON employee_profiles(availability_flag);

-- Create index on geo for location-based queries
CREATE INDEX IF NOT EXISTS idx_employee_profiles_geo ON employee_profiles(geo);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    required_seats INTEGER NOT NULL DEFAULT 0,
    seats_by_type JSONB DEFAULT '{}'::jsonb,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create index on deleted_at for soft deletes
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Create index on start_date and end_date for date range queries
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);

-- Create project_allocations table
CREATE TABLE IF NOT EXISTS project_allocations (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    allocation_type VARCHAR(50) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE, -- nullable as per data model
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create index on deleted_at for soft deletes
CREATE INDEX IF NOT EXISTS idx_project_allocations_deleted_at ON project_allocations(deleted_at);

-- Create index on project_id for faster project-based queries
CREATE INDEX IF NOT EXISTS idx_project_allocations_project_id ON project_allocations(project_id);

-- Create index on employee_id for faster employee-based queries
CREATE INDEX IF NOT EXISTS idx_project_allocations_employee_id ON project_allocations(employee_id);

-- Create index on allocation dates for date range queries
CREATE INDEX IF NOT EXISTS idx_project_allocations_dates ON project_allocations(start_date, end_date);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create index on deleted_at for soft deletes
CREATE INDEX IF NOT EXISTS idx_notifications_deleted_at ON notifications(deleted_at);

-- Create index on user_id for faster user-based queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Create index on is_read for filtering unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create index on created_at for chronological ordering
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create composite index for user unread notifications (common query pattern)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE deleted_at IS NULL;

-- Add updated_at trigger function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at on all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_profiles_updated_at
    BEFORE UPDATE ON employee_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_allocations_updated_at
    BEFORE UPDATE ON project_allocations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- Uncomment the following lines if you want sample data

/*
-- Sample users
INSERT INTO users (first_name, last_name, email, role) VALUES
('John', 'Doe', 'john.doe@company.com', 'Employee'),
('Jane', 'Smith', 'jane.smith@company.com', 'Manager'),
('Bob', 'Johnson', 'bob.johnson@company.com', 'Employee');

-- Sample employee profiles
INSERT INTO employee_profiles (user_id, geo, type, skills, years_of_experience, industry, availability_flag) VALUES
(1, 'US-West', 'Frontend Dev', '["React", "TypeScript", "CSS"]', 5, 'Technology', true),
(3, 'US-East', 'Backend Dev', '["Go", "PostgreSQL", "Docker"]', 3, 'Technology', false);

-- Sample project
INSERT INTO projects (name, description, required_seats, seats_by_type, start_date, end_date, status) VALUES
('Talent Matching Platform', 'AI-powered talent matching system', 3, '{"Frontend Dev": 1, "Backend Dev": 1, "UI": 1}', NOW(), NOW() + INTERVAL '6 months', 'Open');

-- Sample notification
INSERT INTO notifications (type, message, user_id) VALUES
('Roll-off Alert', 'Employee John Doe is rolling off project in 2 weeks', 2);
*/
alter table projects
add column embedding vector(1536);

alter table employee_profiles
    add column embedding vector(1536);


create index if not exists employee_profiles_embedding_idx
    on public.employee_profiles
        using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);

create index if not exists projects_embedding_idx
    on public.projects
        using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);


analyze employee_profiles;
analyze projects;


alter table projects
add column summary text;