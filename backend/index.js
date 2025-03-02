import express from 'express';
import { ConnectToDatabase } from './database/ConnectToDatabase.js';
import dotenv from "dotenv";
import authRoutes from './routes/auth-route.js'
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

ConnectToDatabase();

app.use('/api/auth', authRoutes);

app.listen(3000, () => {
    console.log("server is running on port 3000");
})