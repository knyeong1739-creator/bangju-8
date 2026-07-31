import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zlrggsaaqgxnfralicqt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpscmdnc2FhcWd4bmZyYWxpY3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0OTQwMzYsImV4cCI6MjEwMTA3MDAzNn0.NrGP2Owh1u5PvQ_Xf_yBgfxmJPLsHfBYa3R24nbyk6c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
