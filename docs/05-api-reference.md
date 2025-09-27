# API Reference

## Overview

ClipShare integrates with Supabase backend services to provide file storage and metadata management. This document outlines the API interfaces, database schema, and service layer implementations.

## Supabase Configuration

### Client Setup

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ybueanmewrciysqlkdnb.supabase.co';
const supabaseAnonKey = 'your_anon_key_here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Environment Variables

```bash
# Required environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional configuration
VITE_MAX_FILE_SIZE=52428800  # 50MB in bytes
VITE_MAX_FILES_PER_UPLOAD=10
VITE_FILE_EXPIRY_HOURS=24
```

## Database API

### Schema Definition

```sql
-- Main uploads table
CREATE TABLE uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(8) UNIQUE NOT NULL,
  files JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Indexes for performance
CREATE INDEX idx_uploads_code ON uploads(code);
CREATE INDEX idx_uploads_expires_at ON uploads(expires_at);

-- Row Level Security policies
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON uploads
FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON uploads
FOR INSERT WITH CHECK (true);
```

### Database Operations

#### Save Upload Metadata

```javascript
/**
 * Save upload metadata to database
 * @param {string} code - Unique 8-character code
 * @param {Array} files - Array of file metadata objects
 * @returns {Promise<Object>} Supabase response
 */
const saveUpload = async (code, files) => {
  const { data, error } = await supabase
    .from('uploads')
    .insert([{
      code: code,
      files: files
    }]);
  
  return { data, error };
};

// Usage example
const files = [
  {
    name: 'document.pdf',
    url: 'https://storage.supabase.co/...',
    type: 'application/pdf',
    size: 1024000
  }
];

const result = await saveUpload('ABC12345', files);
```

#### Retrieve Upload by Code

```javascript
/**
 * Retrieve upload metadata by code
 * @param {string} code - Unique sharing code
 * @returns {Promise<Object>} Upload data or error
 */
const getUploadByCode = async (code) => {
  const { data, error } = await supabase
    .from('uploads')
    .select('files, created_at, expires_at')
    .eq('code', code)
    .single();
  
  return { data, error };
};

// Usage example
const upload = await getUploadByCode('ABC12345');
if (upload.error) {
  console.error('Upload not found:', upload.error.message);
} else {
  console.log('Files:', upload.data.files);
}
```

#### Cleanup Expired Uploads

```javascript
/**
 * Delete expired uploads (for maintenance)
 * @returns {Promise<Object>} Deletion result
 */
const cleanupExpiredUploads = async () => {
  const { data, error } = await supabase
    .from('uploads')
    .delete()
    .lt('expires_at', new Date().toISOString());
  
  return { data, error };
};
```

## Storage API

### Bucket Configuration

```javascript
// Storage bucket setup
const BUCKET_NAME = 'clipshare-files';

// Create bucket (admin operation)
const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
  public: true,
  fileSizeLimit: 52428800, // 50MB
  allowedMimeTypes: null // All file types
});
```

### Storage Policies

```sql
-- Allow public file uploads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'clipshare-files');

-- Allow public file access
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'clipshare-files');

-- Allow public file deletion (for cleanup)
CREATE POLICY "Allow public deletion" ON storage.objects
FOR DELETE USING (bucket_id = 'clipshare-files');
```

### File Upload Operations

#### Upload Single File

```javascript
/**
 * Upload a single file to Supabase Storage
 * @param {File} file - File object from input
 * @param {string} path - Storage path (code/filename)
 * @returns {Promise<Object>} Upload result with URL
 */
const uploadFile = async (file, path) => {
  // Upload file
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    return { data: null, error };
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return {
    data: {
      path: data.path,
      url: urlData.publicUrl
    },
    error: null
  };
};

// Usage example
const file = event.target.files[0];
const path = `ABC12345/${file.name}`;
const result = await uploadFile(file, path);
```

#### Upload Multiple Files

```javascript
/**
 * Upload multiple files with progress tracking
 * @param {FileList} files - Files to upload
 * @param {string} code - Unique code for folder structure
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Array>} Array of upload results
 */
const uploadMultipleFiles = async (files, code, onProgress) => {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `${code}/${file.name}`;
    
    try {
      const result = await uploadFile(file, path);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      results.push({
        name: file.name,
        url: result.data.url,
        type: file.type,
        size: file.size
      });
      
      // Update progress
      if (onProgress) {
        onProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
    } catch (error) {
      results.push({
        name: file.name,
        error: error.message
      });
    }
  }
  
  return results;
};
```

#### Get File Public URL

```javascript
/**
 * Get public URL for a stored file
 * @param {string} path - File path in storage
 * @returns {string} Public URL
 */
const getFileUrl = (path) => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
  
  return data.publicUrl;
};
```

#### Delete Files

```javascript
/**
 * Delete files from storage
 * @param {Array<string>} paths - Array of file paths to delete
 * @returns {Promise<Object>} Deletion result
 */
const deleteFiles = async (paths) => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(paths);
  
  return { data, error };
};

// Delete all files for a code
const deleteUploadFiles = async (code, fileNames) => {
  const paths = fileNames.map(name => `${code}/${name}`);
  return await deleteFiles(paths);
};
```

## Service Layer

### Database Service

```javascript
// services/database.js
export class DatabaseService {
  static async saveUpload(code, files) {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .insert([{ code, files }]);
      
      if (error) throw error;
      return { success: true, data };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getUpload(code) {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      
      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Upload has expired');
      }
      
      return { success: true, data };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async cleanupExpired() {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .delete()
        .lt('expires_at', new Date().toISOString());
      
      if (error) throw error;
      return { success: true, deleted: data?.length || 0 };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

### Storage Service

```javascript
// services/storage.js
export class StorageService {
  static bucket = 'clipshare-files';

  static async uploadFile(file, code) {
    try {
      const path = `${code}/${file.name}`;
      
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(path, file);
      
      if (error) throw error;

      const url = this.getPublicUrl(path);
      
      return {
        success: true,
        data: {
          name: file.name,
          url,
          type: file.type,
          size: file.size,
          path: data.path
        }
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static getPublicUrl(path) {
    const { data } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  static async deleteFolder(code) {
    try {
      const { data: files } = await supabase.storage
        .from(this.bucket)
        .list(code);

      if (files && files.length > 0) {
        const paths = files.map(file => `${code}/${file.name}`);
        await supabase.storage
          .from(this.bucket)
          .remove(paths);
      }

      return { success: true };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## Utility Functions

### Code Generation

```javascript
import { nanoid } from 'nanoid';

/**
 * Generate a unique upload code
 * @param {number} length - Code length (default: 8)
 * @returns {string} Generated code
 */
export const generateCode = (length = 8) => {
  return nanoid(length).toUpperCase();
};

/**
 * Validate code format
 * @param {string} code - Code to validate
 * @returns {boolean} Is valid
 */
export const isValidCode = (code) => {
  return /^[A-Za-z0-9]{8}$/.test(code);
};
```

### File Validation

```javascript
/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB
    allowedTypes = null
  } = options;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
    };
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed`
    };
  }

  return { valid: true };
};
```

### Error Handling

```javascript
/**
 * Standardized error handler
 * @param {Error} error - Error object
 * @returns {Object} Formatted error response
 */
export const handleError = (error) => {
  console.error('API Error:', error);
  
  // Supabase specific errors
  if (error.code === 'PGRST116') {
    return {
      message: 'Upload not found or has expired',
      code: 'NOT_FOUND'
    };
  }
  
  if (error.message?.includes('duplicate key')) {
    return {
      message: 'Code already exists, please try again',
      code: 'DUPLICATE_CODE'
    };
  }
  
  // Generic error
  return {
    message: error.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  };
};
```

## Response Formats

### Success Response

```javascript
{
  success: true,
  data: {
    code: "ABC12345",
    files: [
      {
        name: "document.pdf",
        url: "https://storage.supabase.co/...",
        type: "application/pdf",
        size: 1024000
      }
    ],
    created_at: "2025-09-27T10:30:00Z",
    expires_at: "2025-09-28T10:30:00Z"
  }
}
```

### Error Response

```javascript
{
  success: false,
  error: {
    message: "Upload not found or has expired",
    code: "NOT_FOUND",
    details: {} // Additional error details
  }
}
```

## Rate Limiting

### Supabase Built-in Limits

- **Database Operations**: 100 requests per second per IP
- **Storage Operations**: 200 requests per second per IP
- **File Upload Size**: 50MB per file (configurable)
- **Concurrent Connections**: 60 per project

### Custom Rate Limiting (Planned)

```javascript
// Rate limiting middleware (future implementation)
const rateLimiter = {
  uploads: new Map(), // Track uploads per IP
  
  checkLimit(ip, action = 'upload') {
    const key = `${ip}:${action}`;
    const now = Date.now();
    const window = 60 * 1000; // 1 minute
    const limit = action === 'upload' ? 10 : 100;
    
    if (!this.uploads.has(key)) {
      this.uploads.set(key, { count: 1, reset: now + window });
      return { allowed: true, remaining: limit - 1 };
    }
    
    const record = this.uploads.get(key);
    
    if (now > record.reset) {
      record.count = 1;
      record.reset = now + window;
      return { allowed: true, remaining: limit - 1 };
    }
    
    if (record.count >= limit) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: record.reset 
      };
    }
    
    record.count++;
    return { allowed: true, remaining: limit - record.count };
  }
};
```

This API reference provides comprehensive documentation for all current backend integrations and serves as a foundation for future API enhancements.