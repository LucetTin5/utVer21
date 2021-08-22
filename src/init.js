//env  // ==> require('dotenv').config(); === import dotenv from 'dotenv'; dotenv.config();
// import 'dotenv/config';

import 'regenerator-runtime/runtime';
// database
import './db';
import './models/Video';
import './models/User';
import './models/Comment';

// server
import app from './server';

const PORT = process.env.PORT || 8187;
export let isHeroku;
app.listen(PORT, () => {
  isHeroku = process.env.NODE_ENV === 'production' ? true : false;
  console.log(`✅ Server listening on port https://localhost:${PORT}`);
});
