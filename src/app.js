import express from 'express';
import cors from 'cors';

import clientesRoutes from './routes/clientes.routes.js';
import authRoutes from './routes/auth.js';
import productosRoutes from './routes/productos.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import pedidosRoutes from './routes/pedidos.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', authRoutes);
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);
app.use('/api', pedidosRoutes);

const uploadsPath = path.resolve(__dirname, '../uploads');
console.log('📂 Carpeta uploads expuesta en:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));
app.use('/api', pedidosRoutes);
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
});

export default app;