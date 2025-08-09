import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ybueanmewrciysqlkdnb.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidWVhbm1ld3JjaXlzcWxrZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTczOTQsImV4cCI6MjA3MDMzMzM5NH0.AEELMNqw6PnnQplvTBAfVUYovG7SXgmJOZGr4O-mrJQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
