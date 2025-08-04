import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqsbgacvxenoopjogurq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxc2JnYWN2eGVub29wam9ndXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzkzOTksImV4cCI6MjA2OTM1NTM5OX0.G6vgHF-ENfECqJLhYGWWkFDo12_qN73vCCmem-r7zAA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);