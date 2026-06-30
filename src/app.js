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

<<<<<<< HEAD
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
=======
// 1. Configuración CORS - Permitir todo y los métodos necesarios
app.use(cors({
    origin: '*', // Esto sigue permitiendo todo
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Añadimos X-Requested-With
    credentials: true // Necesario para que el navegador acepte CORS en muchos casos
}));

// 2. SOLUCIÓN AL ERROR DE RUTA: 
// En lugar de app.options('*', cors()), usamos un middleware manual
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

// Aumentamos el límite para imágenes Base64 grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas
app.use('/api', authRoutes);
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);
>>>>>>> 9e0390d69623f43adb1e6216e7622187d6a391a8

const uploadsPath = path.resolve(__dirname, '../uploads');
console.log('📂 Carpeta uploads expuesta en:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));
<<<<<<< HEAD
app.use('/api', pedidosRoutes);
app.use((req, res) => {
=======

// Middleware de error 404
app.use((req, res, next) => {
>>>>>>> 9e0390d69623f43adb1e6216e7622187d6a391a8
    res.status(404).json({
        message: 'Endpoint not found'
    });
});

export default app;