// server.js
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import routes from './routes/index.js';
import { connectDB } from './config/db.js';
import { initDB } from './models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// api routes
app.use('/api', routes);

// health
app.get('/', (req, res) => res.send('Backend is running!'));

const start = async () => {
    try {
        await connectDB();
        await initDB();
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
};

start();
