-- Migration: 002_add_slack_user_id.sql
-- Description: Add Slack user id column for DM notifications

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS slack_user_id VARCHAR(64);

-- Optional index if lookups are frequent
CREATE INDEX IF NOT EXISTS idx_users_slack_user_id ON users(slack_user_id);


