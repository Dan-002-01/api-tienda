import express from 'express';
import cors from 'cors';

import clientesRoutes from './routes/clientes.routes.js';
import authRoutes from './routes/auth.js';
import productosRoutes from './routes/productos.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//CONFIGURACIÓN CORS OPTIMIZADA PARA ANDROID
// Permitimos todos los orígenes y los métodos necesarios, incluyendo OPTIONS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Responder automáticamente a las peticiones OPTIONS (Preflight)
app.options('*', cors());

// Aumentamos el límite para imágenes Base64 grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas
app.use('/api', authRoutes);
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);

const uploadsPath = path.resolve(__dirname, '../uploads');
console.log('📂 Carpeta uploads expuesta en:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Middleware de error 404
app.use((req, res, next) => {
    res.status(404).json({ // Cambiado de 400 a 404 (Not Found)
        message: 'Endpoint not found'
    });
});

export default app;