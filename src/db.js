import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const URL = process.env.DB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log('✅ Connected to DB');
const handleError = (err) => console.log('❌ DB error: ', err);

db.once('open', handleOpen);
db.on('error', handleError);
