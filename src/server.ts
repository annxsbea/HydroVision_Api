import express from 'express';
import bodyParser from 'body-parser';
import measureRoutes from './routes/measureRoutes'; // Ajuste o caminho se necessário
import connectDB from './db';
connectDB();
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', measureRoutes); // Prefixo /api para as rotas

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
