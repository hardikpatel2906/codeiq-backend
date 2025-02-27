import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import route from './routes';

dotenv.config();

const app = express();
app.use(express.json())
app.use(route);

// Call to connect databse
connectDB();


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})