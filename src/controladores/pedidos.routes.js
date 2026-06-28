import express from 'express';
import pool from '../db.js';

const router = express.Router();

// 🔥 CREAR PEDIDO COMPLETO
router.post('/pedidos', async (req, res) => {

  const { cli_id, usr_id, ped_estado, detalles } = req.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Insertar pedido
    const [pedidoResult] = await conn.query(
      `INSERT INTO pedidos (cli_id, usr_id, ped_estado)
       VALUES (?, ?, ?)`,
      [cli_id, usr_id, ped_estado]
    );

    const ped_id = pedidoResult.insertId;

    // 2. Insertar detalles
    for (const item of detalles) {
      await conn.query(
        `INSERT INTO pedidos_detalle 
        (prod_id, ped_id, det_cantidad, det_precio)
        VALUES (?, ?, ?, ?)`,
        [
          item.prod_id,
          ped_id,
          item.det_cantidad,
          item.det_precio
        ]
      );
    }

    await conn.commit();

    res.json({
      ok: true,
      message: 'Pedido registrado correctamente',
      ped_id
    });

  } catch (error) {
    await conn.rollback();
    res.status(500).json({
      ok: false,
      message: error.message
    });
  } finally {
    conn.release();
  }

}
);nose 

router.get('/pedidos/cliente/:id', async (req, res) => {

  const { id } = req.params;

  try {
    const [pedidos] = await pool.query(`
      SELECT * 
      FROM pedidos
      WHERE cli_id = ?
      ORDER BY ped_fecha DESC
    `, [id]);

    res.json(pedidos);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get('/pedidos/:id/detalle', async (req, res) => {

  const { id } = req.params;

  try {
    const [detalle] = await pool.query(`
      SELECT 
        pd.prod_id,
        p.prod_nombre,
        pd.det_cantidad,
        pd.det_precio
      FROM pedidos_detalle pd
      JOIN productos p ON p.prod_id = pd.prod_id
      WHERE pd.ped_id = ?
    `, [id]);

    res.json(detalle);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;