import { conmysql } from '../db.js';

/* =========================
   LISTAR PRODUCTOS
========================= */
export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos');
        
        // Ya no concatenamos la URL de Render porque prod_imagen ahora será el texto Base64 puro
        res.json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error al consultar productos'
        });
    }
};

/* =========================
   OBTENER PRODUCTO POR ID 🔍
========================= */
export const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query(
            'SELECT * FROM productos WHERE prod_id = ?',
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        // 🌟 CORREGIDO: Retorna el registro directo con su Base64 sin alterarlo con la URL de Render
        res.json(result[0]);

    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener el producto en el servidor'
        });
    }
};

/* =========================
   INSERTAR PRODUCTO ➕
========================= */
export const postProducto = async (req, res) => {
    try {
        console.log("Datos recibidos en servidor:", req.body);
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo,
            prod_imagen // <-- Ahora es un string Base64 que viene en el JSON
        } = req.body;

        const stockFinal = isNaN(Number(prod_stock)) ? 0 : Number(prod_stock);
        const precioFinal = isNaN(Number(prod_precio)) ? 0.00 : Number(prod_precio);
        const activoFinal = (prod_activo === true || prod_activo === 'true' || prod_activo == 1) ? 1 : 0;

        const [result] = await conmysql.query(
            `INSERT INTO productos
            (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [prod_codigo, prod_nombre, stockFinal, precioFinal, activoFinal, prod_imagen]
        );

        res.json({ prod_id: result.insertId });
        res.status(200).json({ message: "Éxito" });
    } catch (error) {
        console.error("ERROR REAL EN EL SERVIDOR:", error);
        res.status(500).json({ error: error.message });
        return res.status(500).json({
            message: "Error en servidor",
            error: error.message
        });
    }
};

/* =========================
   ACTUALIZAR PRODUCTO ✏️
========================= */
export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo,
            prod_imagen // <-- String Base64 nuevo o el anterior
        } = req.body;

        const stockFinal = isNaN(Number(prod_stock)) ? 0 : Number(prod_stock);
        const precioFinal = isNaN(Number(prod_precio)) ? 0.00 : Number(prod_precio);
        const activoFinal = (prod_activo === true || prod_activo === 'true' || prod_activo == 1) ? 1 : 0;

        const [result] = await conmysql.query(
            `UPDATE productos SET
            prod_codigo=?,
            prod_nombre=?,
            prod_stock=?,
            prod_precio=?,
            prod_activo=?,
            prod_imagen=?
            WHERE prod_id=?`,
            [prod_codigo, prod_nombre, stockFinal, precioFinal, activoFinal, prod_imagen, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

/* =========================
   ELIMINAR PRODUCTO ❌
========================= */
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await conmysql.query(
            'DELETE FROM productos WHERE prod_id=?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        res.json({
            message: 'Producto eliminado'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error servidor'
        });
    }
};