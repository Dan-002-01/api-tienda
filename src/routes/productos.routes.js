import { Router } from 'express';

import {
    getProductos,
    postProducto,
    putProducto,
    deleteProducto
} from '../controladores/productosCtrl.js';

import { verificarToken } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.get(
    '/productos',
    verificarToken,
    getProductos
);

router.post(
  '/productos',
  verificarToken,
  upload.single('imagen'),
  postProducto
);

router.put(
    '/productos/:id',
    verificarToken,
    upload.single('imagen'),
    putProducto
);

router.delete(
    '/productos/:id',
    verificarToken,
    deleteProducto
);

export default router;