import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import measureRoutes from './routes/measureRoutes'; // Adjust the path if necessary
import connectDB from './db';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

connectDB();

const app = express();

const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors()); 
app.use(bodyParser.json()); 

// Routes
app.use('/api', measureRoutes); 

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
