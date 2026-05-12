const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../supabaseAdmin');

// GET /api/logs — fetch all logs for user
router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date', { ascending: false });
    
  if (error) return res.status(500).json({ error: error.message });
  
  // Format to camelCase for frontend
  const formattedData = data.map(log => ({
    ...log,
    cycleDay: log.cycle_day,
    userId: log.user_id,
    createdAt: log.created_at
  }));
  
  res.json(formattedData);
});

// POST /api/logs — create new log
router.post('/', auth, async (req, res) => {
  const dbPayload = {
    user_id: req.user.id,
    date: req.body.date,
    symptoms: req.body.symptoms || []
  };

  if (req.body.cycleDay !== undefined && req.body.cycleDay !== null) dbPayload.cycle_day = req.body.cycleDay;
  if (req.body.mood !== undefined && req.body.mood !== null) dbPayload.mood = req.body.mood;
  if (req.body.energy !== undefined && req.body.energy !== null) dbPayload.energy = req.body.energy;
  if (req.body.sleep !== undefined && req.body.sleep !== null) dbPayload.sleep = req.body.sleep;
  if (req.body.notes !== undefined && req.body.notes !== null) dbPayload.notes = req.body.notes;
  if (req.body.tags !== undefined && req.body.tags !== null) dbPayload.tags = req.body.tags;

  const { data, error } = await supabase
    .from('symptom_logs')
    .insert(dbPayload)
    .select().single();
    
  if (error) {
    console.error('Insert log error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  // Return formatted camelCase
  res.status(201).json({
    ...data,
    cycleDay: data.cycle_day,
    userId: data.user_id,
    createdAt: data.created_at
  });
});

// DELETE /api/logs/:id
router.delete('/:id', auth, async (req, res) => {
  const { error } = await supabase.from('symptom_logs')
    .delete().eq('id', req.params.id).eq('user_id', req.user.id);
    
  if (error) return res.status(500).json({ error: error.message });
  
  res.json({ success: true });
});

module.exports = router;
