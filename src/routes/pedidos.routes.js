import express from 'express';
import { guardarPedido } from '../controladores/pedidosCtrl.js';

const router = express.Router();

// Única ruta para procesar y guardar la orden completa
router.post('/pedidos', guardarPedido);

export default router;