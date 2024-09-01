import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import chatbotRouter from './routes/chatbot.route.js';
import locationRouter from './routes/location.route.js';
import { userRouter } from './routes/user.routes.js';
import healthRouter from './routes/healthMetrics.route.js';
import cookieParser from 'cookie-parser';


dotenv.config();


const { PORT, MongoURI , SMTP_PASS } = process.env;

const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173']
}))
app.use(cookieParser());

mongoose.connect(MongoURI, {})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


app.use('/api/user', userRouter)
app.use('/api/places', locationRouter)
app.use('/api/chatbot', chatbotRouter)
app.use('/api/metrics',healthRouter);


app.get('/', (req, res) => {
    res.json('Backend is running');
});

app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
})