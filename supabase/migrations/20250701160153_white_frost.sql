-- Create sync_billing_dates function outside the DO block
CREATE OR REPLACE FUNCTION sync_billing_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF NEW.current_billing_period_ends_at IS DISTINCT FROM OLD.current_billing_period_ends_at THEN
            NEW.next_billing_date := NEW.current_billing_period_ends_at;
        ELSIF NEW.next_billing_date IS DISTINCT FROM OLD.next_billing_date THEN
            NEW.current_billing_period_ends_at := NEW.next_billing_date;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if the updated_at column exists in profiles
DO $$
DECLARE
    has_updated_at BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'updated_at'
    ) INTO has_updated_at;
    
    -- If updated_at doesn't exist, disable the trigger temporarily
    IF NOT has_updated_at THEN
        -- Check if the trigger exists before trying to disable it
        IF EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'update_profiles_updated_at'
        ) THEN
            ALTER TABLE profiles DISABLE TRIGGER update_profiles_updated_at;
        END IF;
    END IF;
END $$;

-- Fix column names in profiles table
DO $$
BEGIN
    -- Check if current_billing_period_ends_at exists but next_billing_date doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'profiles' AND column_name = 'current_billing_period_ends_at') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'profiles' AND column_name = 'next_billing_date') THEN
        -- Add next_billing_date as an alias to current_billing_period_ends_at
        ALTER TABLE profiles ADD COLUMN next_billing_date TIMESTAMPTZ;
        
        -- Create a trigger to keep the columns in sync
        DROP TRIGGER IF EXISTS sync_billing_dates_trigger ON profiles;
        CREATE TRIGGER sync_billing_dates_trigger
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION sync_billing_dates();
        
        -- Initialize next_billing_date with current values
        UPDATE profiles 
        SET next_billing_date = current_billing_period_ends_at
        WHERE current_billing_period_ends_at IS NOT NULL;
    END IF;

    -- Check if next_billing_date exists but current_billing_period_ends_at doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'profiles' AND column_name = 'next_billing_date') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'profiles' AND column_name = 'current_billing_period_ends_at') THEN
        -- Add current_billing_period_ends_at as an alias to next_billing_date
        ALTER TABLE profiles ADD COLUMN current_billing_period_ends_at TIMESTAMPTZ;
        
        -- Create a trigger to keep the columns in sync
        DROP TRIGGER IF EXISTS sync_billing_dates_trigger ON profiles;
        CREATE TRIGGER sync_billing_dates_trigger
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION sync_billing_dates();
        
        -- Initialize current_billing_period_ends_at with current values
        UPDATE profiles 
        SET current_billing_period_ends_at = next_billing_date
        WHERE next_billing_date IS NOT NULL;
    END IF;

    -- Ensure all required columns exist with proper defaults
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'max_test_duration_minutes') THEN
        ALTER TABLE profiles ADD COLUMN max_test_duration_minutes INTEGER DEFAULT 5 NOT NULL;
    END IF;
END $$;

-- Make sure all required columns have NOT NULL and DEFAULT values
-- Doing this outside the DO block to avoid potential issues
ALTER TABLE profiles 
    ALTER COLUMN subscription_status SET DEFAULT 'FREE';

ALTER TABLE profiles 
    ALTER COLUMN subscription_status SET NOT NULL;

ALTER TABLE profiles 
    ALTER COLUMN plan_type SET DEFAULT 'free';

ALTER TABLE profiles 
    ALTER COLUMN plan_type SET NOT NULL;

ALTER TABLE profiles 
    ALTER COLUMN tests_this_month_count SET DEFAULT 0;

ALTER TABLE profiles 
    ALTER COLUMN tests_this_month_count SET NOT NULL;

ALTER TABLE profiles 
    ALTER COLUMN concurrent_test_slots SET DEFAULT 1;

ALTER TABLE profiles 
    ALTER COLUMN concurrent_test_slots SET NOT NULL;

ALTER TABLE profiles 
    ALTER COLUMN max_test_duration_minutes SET DEFAULT 5;

ALTER TABLE profiles 
    ALTER COLUMN max_test_duration_minutes SET NOT NULL;

ALTER TABLE profiles 
    ALTER COLUMN industry SET DEFAULT 'Other';

-- Re-enable the trigger if it was disabled and exists
DO $$
DECLARE
    has_updated_at BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'updated_at'
    ) INTO has_updated_at;
    
    -- If updated_at exists, make sure the trigger is enabled
    IF has_updated_at THEN
        -- Check if the trigger exists before trying to enable it
        IF EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'update_profiles_updated_at'
        ) THEN
            ALTER TABLE profiles ENABLE TRIGGER update_profiles_updated_at;
        END IF;
    END IF;
END $$;