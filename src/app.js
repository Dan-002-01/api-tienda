import express from 'express';
import cors from 'cors';

import clientesRoutes from './routes/clientes.routes.js';
import authRoutes from './routes/auth.js';

import productosRoutes
from './routes/productos.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

// rutas
app.use('/api', authRoutes);
app.use('/api', clientesRoutes);

app.use('/api', productosRoutes);
const uploadsPath = path.resolve(__dirname, '../uploads');
console.log('📂 Carpeta uploads expuesta en ojo:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));
app.use((req, res, next) => {
    res.status(400).json({
        message: 'Endpoint not found'
    });
});

export default app;