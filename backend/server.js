// TriNetra Master Backend Engine - Initializing...
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API Route Check
app.get('/', (req, res) => {
  res.send('TriNetra Backend Engine is LIVE 👁️🔥');
});

app.listen(port, () => {
  console.log(`TriNetra Engine running on port ${port}`);
});
