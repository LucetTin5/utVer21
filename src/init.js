//env  // ==> require('dotenv').config(); === import dotenv from 'dotenv'; dotenv.config();
import 'dotenv/config';

// database
import './db';
import './models/Video';
import './models/User';

// server
import app from './server';

const PORT = process.env.PORT || 8187;

app.listen(PORT, () =>
  console.log(`✅ Server listening on port https://localhost:${PORT}`)
);
