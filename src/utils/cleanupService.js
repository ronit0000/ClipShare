// Cleanup service for expired files
import { supabase } from '../supabaseClient';
import { getExpiredFileIds } from './expirationUtils';

/**
 * Clean up expired files from storage and database
 * This should be run periodically (e.g., via cron job or scheduled function)
 */
export const cleanupExpiredFiles = async () => {
  try {
    console.log('Starting cleanup of expired files...');
    
    // Get all expired uploads
    const { data: expiredUploads, error: fetchError } = await supabase
      .from('uploads')
      .select('id, code, files, expires_at')
      .lt('expires_at', new Date().toISOString());
    
    if (fetchError) {
      console.error('Error fetching expired uploads:', fetchError);
      return { success: false, error: fetchError };
    }
    
    if (!expiredUploads || expiredUploads.length === 0) {
      console.log('No expired files found.');
      return { success: true, cleaned: 0 };
    }
    
    console.log(`Found ${expiredUploads.length} expired uploads to clean up.`);
    
    let cleanedCount = 0;
    const errors = [];
    
    for (const upload of expiredUploads) {
      try {
        // Delete files from storage
        if (upload.files && Array.isArray(upload.files)) {
          for (const file of upload.files) {
            // Extract file path from URL or construct it
            const filePath = `${upload.code}/${file.name}`;
            const { error: storageError } = await supabase.storage
              .from('clipshare-files')
              .remove([filePath]);
            
            if (storageError) {
              console.warn(`Failed to delete file ${filePath}:`, storageError);
              // Continue with other files even if one fails
            }
          }
        }
        
        // Delete upload record from database
        const { error: dbError } = await supabase
          .from('uploads')
          .delete()
          .eq('id', upload.id);
        
        if (dbError) {
          console.error(`Failed to delete upload record ${upload.id}:`, dbError);
          errors.push({ uploadId: upload.id, error: dbError });
        } else {
          cleanedCount++;
          console.log(`Cleaned up expired upload: ${upload.code}`);
        }
        
      } catch (error) {
        console.error(`Error cleaning upload ${upload.code}:`, error);
        errors.push({ uploadId: upload.id, error });
      }
    }
    
    console.log(`Cleanup completed. Cleaned ${cleanedCount} uploads.`);
    
    return {
      success: true,
      cleaned: cleanedCount,
      total: expiredUploads.length,
      errors: errors.length > 0 ? errors : null
    };
    
  } catch (error) {
    console.error('Cleanup service error:', error);
    return { success: false, error };
  }
};

/**
 * Get cleanup statistics
 */
export const getCleanupStats = async () => {
  try {
    // Count total uploads
    const { count: totalCount, error: totalError } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) {
      throw totalError;
    }
    
    // Count expired uploads
    const { count: expiredCount, error: expiredError } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true })
      .lt('expires_at', new Date().toISOString());
    
    if (expiredError) {
      throw expiredError;
    }
    
    // Count uploads expiring in next 24 hours
    const next24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { count: expiringCount, error: expiringError } = await supabase
      .from('uploads')
      .select('*', { count: 'exact', head: true })
      .gt('expires_at', new Date().toISOString())
      .lt('expires_at', next24Hours);
    
    if (expiringError) {
      throw expiringError;
    }
    
    return {
      total: totalCount || 0,
      expired: expiredCount || 0,
      expiringSoon: expiringCount || 0,
      active: (totalCount || 0) - (expiredCount || 0)
    };
    
  } catch (error) {
    console.error('Error getting cleanup stats:', error);
    return null;
  }
};

/**
 * Schedule automatic cleanup (for client-side usage)
 * Note: In production, use server-side cron jobs or cloud functions
 */
export const scheduleCleanup = (intervalMinutes = 60) => {
  const intervalMs = intervalMinutes * 60 * 1000;
  
  const cleanupInterval = setInterval(async () => {
    console.log('Running scheduled cleanup...');
    await cleanupExpiredFiles();
  }, intervalMs);
  
  // Run cleanup immediately
  cleanupExpiredFiles();
  
  // Return cleanup function
  return () => {
    clearInterval(cleanupInterval);
    console.log('Cleanup schedule stopped.');
  };
};