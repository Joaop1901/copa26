const SUPABASE_URL = "https://deimcjjpfrxxdntuvlnf.supabase.co";

// COLE AQUI SUA ANON PUBLIC KEY OU PUBLISHABLE KEY
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaW1jampwZnJ4eGRudHV2bG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODc0MzMsImV4cCI6MjA5MzE2MzQzM30.gjp3giPYBT61ebwBEt2D00cMyL037i1D1pLN9QPXCac";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);