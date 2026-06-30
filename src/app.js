import express from 'express';
import cors from 'cors';

import clientesRoutes from './routes/clientes.routes.js';
import authRoutes from './routes/auth.js';
import productosRoutes from './routes/productos.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Responder solicitudes OPTIONS
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// Límite para imágenes Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

// Rutas
app.use('/api', authRoutes);
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidosRoutes);

// Carpeta pública uploads
const uploadsPath = path.resolve(__dirname, '../uploads');
console.log('📂 Carpeta uploads expuesta en:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Error 404
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
});

export default app;