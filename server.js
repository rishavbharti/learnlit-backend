import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
const logger = require('morgan');

// Create express app
const app = express();
dotenv.config();

// Apply Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
