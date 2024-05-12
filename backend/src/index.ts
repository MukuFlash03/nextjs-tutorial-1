import dotenv from "dotenv";
import express, { Express, Request, Response } from 'express';
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.BACKEND_DOCKER_PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send("NextJS React Foundations Tutorial Backend Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
