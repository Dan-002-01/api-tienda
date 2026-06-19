import { Router } from 'express';

import {
    getProductos,
    getProductoById, // 🌟 NUEVO: Importamos el controlador para buscar por ID
    postProducto,
    putProducto,
    deleteProducto
} from '../controladores/productosCtrl.js';

import { verificarToken } from '../middlewares/auth.js';
// 🌟 Ya no importamos 'upload.js' porque las imágenes viajan como texto Base64 dentro del JSON

const router = Router();

/* ==========================================
   RUTAS DE PRODUCTOS
========================================== */

// Listar todos los productos
router.get(
    '/productos',
    verificarToken,
    getProductos
);

//Obtener un solo producto por su ID (Para la pantalla de Editar)
router.get(
    '/productos/:id',
    verificarToken,
    getProductoById
);

// Registrar un nuevo producto (JSON limpio con Base64)
router.post(
    '/productos',
    verificarToken,
    postProducto
);

// Actualizar un producto existente (JSON limpio con Base64)
router.put(
    '/productos/:id',
    verificarToken,
    putProducto
);

// Eliminar un producto
router.delete(
    '/productos/:id',
    verificarToken,
    deleteProducto
);

export default router;