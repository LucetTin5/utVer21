import mongoose from 'mongoose';

const URL = 'mongodb://127.0.0.1:27017/ut21';

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log('✅ Connected to DB');
const handleError = (err) => console.log('💢 DB error: ', err);

db.once('open', handleOpen);
db.on('error', handleError);
