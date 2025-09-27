-- =================================================================
-- ClipShare v1.1.0 Database Schema Updates
-- =================================================================
-- Platform: Supabase (PostgreSQL)
-- Execute this in your Supabase Dashboard > SQL Editor
-- 
-- IMPORTANT: Run these commands one by one to check for errors
-- =================================================================

-- Step 1: Add password protection column
-- Safe to run multiple times (uses IF NOT EXISTS equivalent)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'uploads' AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE uploads ADD COLUMN password_hash TEXT DEFAULT NULL;
        RAISE NOTICE 'Added password_hash column to uploads table';
    ELSE
        RAISE NOTICE 'password_hash column already exists';
    END IF;
END $$;

-- Step 2: Add expiration hours column
-- Safe to run multiple times
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'uploads' AND column_name = 'expiry_hours'
    ) THEN
        ALTER TABLE uploads ADD COLUMN expiry_hours INTEGER DEFAULT 24;
        RAISE NOTICE 'Added expiry_hours column to uploads table';
    ELSE
        RAISE NOTICE 'expiry_hours column already exists';
    END IF;
END $$;

-- Step 2b: Add expires_at column (absolute expiration timestamp)
-- Safe to run multiple times
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'uploads' AND column_name = 'expires_at'
    ) THEN
        ALTER TABLE uploads ADD COLUMN expires_at TIMESTAMPTZ DEFAULT NULL;
        RAISE NOTICE 'Added expires_at column to uploads table';
    ELSE
        RAISE NOTICE 'expires_at column already exists';
    END IF;
END $$;

-- Step 3: Update existing records to have default expiry_hours and calculate expires_at
-- Safe to run multiple times
UPDATE uploads 
SET expiry_hours = 24 
WHERE expiry_hours IS NULL;

-- Step 3b: Calculate expires_at for existing records based on created_at + expiry_hours
-- Safe to run multiple times
UPDATE uploads 
SET expires_at = created_at + INTERVAL '1 hour' * COALESCE(expiry_hours, 24)
WHERE expires_at IS NULL AND created_at IS NOT NULL;

-- Step 4: Add performance index for password queries
-- Safe to run multiple times
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_uploads_password_hash'
    ) THEN
        CREATE INDEX idx_uploads_password_hash 
        ON uploads(password_hash) 
        WHERE password_hash IS NOT NULL;
        RAISE NOTICE 'Created index idx_uploads_password_hash';
    ELSE
        RAISE NOTICE 'Index idx_uploads_password_hash already exists';
    END IF;
END $$;

-- Step 5: Add index for expiration queries (for cleanup efficiency)
-- Safe to run multiple times
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_uploads_expires_at'
    ) THEN
        CREATE INDEX idx_uploads_expires_at 
        ON uploads(expires_at) 
        WHERE expires_at IS NOT NULL;
        RAISE NOTICE 'Created index idx_uploads_expires_at';
    ELSE
        RAISE NOTICE 'Index idx_uploads_expires_at already exists';
    END IF;
END $$;

-- Step 6: Add column comments for documentation
COMMENT ON COLUMN uploads.password_hash IS 'Bcrypt hash of optional password protection (12 rounds)';
COMMENT ON COLUMN uploads.expiry_hours IS 'Hours until file expires: 1=1hour, 4=4hours, 24=1day, 168=1week';
COMMENT ON COLUMN uploads.expires_at IS 'Absolute expiration timestamp (calculated from created_at + expiry_hours)';

-- =================================================================
-- Verification Queries (Optional - run to check your changes)
-- =================================================================

-- Check table structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'uploads' 
-- ORDER BY ordinal_position;

-- Check indexes
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'uploads';

-- Count existing records
-- SELECT 
--     COUNT(*) as total_uploads,
--     COUNT(password_hash) as protected_uploads,
--     AVG(expiry_hours) as avg_expiry_hours
-- FROM uploads;