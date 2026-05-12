require('dotenv').config({ path: 'bloom-backend/.env' });
const supabase = require('./bloom-backend/src/supabaseAdmin');

async function testInsert() {
  const dbPayload = {
    user_id: 'a-dummy-user-id', // Use a random UUID that might fail FK, but let's see what error it gives
    date: '2026-05-12',
    cycle_day: null,
    symptoms: [ { name: 'Cramps', category: 'pain', severity: 3, duration: 'Not specified' } ],
    mood: { primary: 'Happy', secondary: [], score: 5 },
    energy: 5,
    sleep: { hours: 7, quality: 3, disturbances: [] },
    notes: '',
    tags: []
  };

  const { data, error } = await supabase
    .from('symptom_logs')
    .insert(dbPayload)
    .select();

  console.log('Result:', data, 'Error:', error);
}

testInsert();
