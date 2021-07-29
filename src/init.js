// database
import './db';
import './models/Video';
// import './models/User';

// env
import dotenv from 'dotenv';
dotenv.config();

// server
import app from './server';

const PORT = process.env.PORT || 8187;

app.listen(PORT, () =>
  console.log(`✅ Server listening on port https://localhost:${PORT}`)
);
