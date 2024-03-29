//env  // ==> require('dotenv').config(); === import dotenv from 'dotenv'; dotenv.config();
// only for dev local
// import 'dotenv/config';

// async
import 'regenerator-runtime/runtime';
// database
import './db';
import './models/Video';
import './models/User';
import './models/Comment';

// server
import app from './server';

const PORT = process.env.PORT || 8187;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port https://localhost:${PORT}`);
});
