import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://roaxpsvmhtgnmvjgtwds.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYXhwc3ZtaHRnbm12amd0d2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MzAzMjEsImV4cCI6MjA5MTEwNjMyMX0.1O5akTrFaT3mp5hSfb66DaWOjEP7twfMLy_8ln-5i80';

export const supabase = createClient(supabaseUrl, supabaseKey);