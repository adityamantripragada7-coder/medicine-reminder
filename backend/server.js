const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok', service: 'medicine-reminder-api' });
});

app.listen(PORT, () => {
  console.log(`Medicine Reminder API running on http://localhost:${PORT}`);
});
