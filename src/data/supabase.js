import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qoonzkzcuszpkaxhrndl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvb256a3pjdXN6cGtheGhybmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODY0MTAsImV4cCI6MjA3NTA2MjQxMH0.2Ry_7yCMb7ezHdBFogJW0JVpQxgYdxVjMaCiwtZ1_24";

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;