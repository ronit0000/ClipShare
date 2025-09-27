# 🗄️ Supabase Database Setup Guide

## 📋 Prerequisites
- Access to your Supabase dashboard
- Admin privileges for your ClipShare project database

## 🚀 Step-by-Step Database Update

### Step 1: Access Supabase SQL Editor
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your ClipShare project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Execute Database Updates
1. Open the `database-updates.sql` file in your project
2. **Copy and paste the ENTIRE script** into the Supabase SQL Editor
3. Click **"Run"** to execute all commands

### Step 3: Verify Installation
The script will show output messages like:
```
NOTICE: Added password_hash column to uploads table
NOTICE: Added expiry_hours column to uploads table  
NOTICE: Created index idx_uploads_password_hash
NOTICE: Created index idx_uploads_expires_at
```

### Step 4: Optional Verification
Run this query to check your table structure:
```sql
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'uploads' 
ORDER BY ordinal_position;
```

Expected output should include:
- `password_hash` (text, nullable)
- `expiry_hours` (integer, default: 24)

## 🔧 What This Script Does

### Database Changes:
- ✅ **Adds `password_hash` column** - Stores bcrypt password hashes
- ✅ **Adds `expiry_hours` column** - Configurable expiration (1, 4, 24, 168 hours)
- ✅ **Updates existing records** - Sets default 24-hour expiration
- ✅ **Creates performance indexes** - Optimizes password and expiration queries
- ✅ **Adds documentation** - Column comments for clarity

### Safety Features:
- ✅ **Idempotent operations** - Safe to run multiple times
- ✅ **Existence checks** - Won't duplicate columns or indexes
- ✅ **Clear notifications** - Shows what was created/skipped
- ✅ **PostgreSQL compatible** - Works perfectly with Supabase

## ⚠️ Important Notes

### Before Running:
- **Backup your data** (though these operations are safe)
- **Test in development first** if you have a staging environment
- **Run during low-traffic periods** for production databases

### After Running:
- Your existing uploaded files will work unchanged
- New uploads will have the enhanced security features
- The cleanup service will only affect new uploads with expiration

## 🧪 Testing the Changes

After running the script, test by:
1. **Upload a file with password protection**
2. **Try different expiration times**
3. **Verify password verification works**
4. **Check that expired files are inaccessible**

## 🆘 Troubleshooting

### Common Issues:
- **"relation uploads does not exist"** - Make sure your uploads table exists
- **"permission denied"** - Ensure you have admin access to the database
- **"syntax error"** - Copy the exact script without modifications

### Support:
If you encounter issues, the script includes verification queries at the bottom to help diagnose problems.

## ✅ Success Confirmation

After successful execution, your ClipShare application will support:
- 🔐 Optional password protection for uploads
- ⏰ Configurable file expiration (1h, 4h, 24h, 7d)
- 🧹 Automated cleanup of expired files
- 📊 Performance-optimized database queries

Your ClipShare v1.1.0 security features are now ready! 🎉