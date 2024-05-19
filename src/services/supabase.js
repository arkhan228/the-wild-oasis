import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://parhuahzeiylrvfgxafx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhcmh1YWh6ZWl5bHJ2Zmd4YWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyMDk4MTksImV4cCI6MjAyNzc4NTgxOX0.rdTEoZ3CvzFraCobSiLq9uWLYklnn7J0H5OA50TAkPo';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
