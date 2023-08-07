import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const logger = require('morgan');

// Create express app
const app = express();
dotenv.config();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB Connected'))
  .catch((e) => console.error(e));

// Apply Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://learnlit.vercel.app',
      'https://learnlit.tech',
    ],
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('API available at /api');
});

['auth', 'course', 'instructor', 'user'].map((r) =>
  app.use('/api', require(`./routes/${r}`))
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
