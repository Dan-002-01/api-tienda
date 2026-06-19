import { conmysql } from '../db.js';

/* =========================
   LISTAR PRODUCTOS
========================= */
export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            'SELECT * FROM productos'
        );

        const baseUrl = process.env.BASE_URL || 'https://api-tienda-dmwf.onrender.com';

        const productos = result.map(p => ({
            ...p,
            prod_imagen: p.prod_imagen
                ? `${baseUrl}${p.prod_imagen}`
                : null
        }));

        res.json(productos);

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

        const baseUrl = process.env.BASE_URL || 'https://api-tienda-dmwf.onrender.com';
        const producto = {
            ...result[0],
            prod_imagen: result[0].prod_imagen
                ? `${baseUrl}${result[0].prod_imagen}`
                : null
        };

        res.json(producto);

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
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo
        } = req.body;

        // Validaciones preventivas para evitar valores NaN o corruptos en MySQL
        const stockFinal = isNaN(Number(prod_stock)) ? 0 : Number(prod_stock);
        const precioFinal = isNaN(Number(prod_precio)) ? 0.00 : Number(prod_precio);
        
        // Convierte correctamente "true", true o 1 enviado desde Ionic a un entero (1 o 0)
        const activoFinal = (prod_activo === true || prod_activo === 'true' || prod_activo == 1) ? 1 : 0;

        const prod_imagen = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const [result] = await conmysql.query(
            `INSERT INTO productos
            (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                prod_codigo,
                prod_nombre,
                stockFinal,
                precioFinal,
                activoFinal,
                prod_imagen
            ]
        );

        res.json({ prod_id: result.insertId });

    } catch (error) {
        console.log("🔥 ERROR REAL:", error);
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
            prod_activo
        } = req.body;

        // Validaciones preventivas para evitar valores NaN o corruptos en MySQL
        const stockFinal = isNaN(Number(prod_stock)) ? 0 : Number(prod_stock);
        const precioFinal = isNaN(Number(prod_precio)) ? 0.00 : Number(prod_precio);
        const activoFinal = (prod_activo === true || prod_activo === 'true' || prod_activo == 1) ? 1 : 0;

        let prod_imagen = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        // Si no hay nueva imagen, mantener la anterior guardada en la BD
        if (!req.file) {
            const [rows] = await conmysql.query(
                'SELECT prod_imagen FROM productos WHERE prod_id=?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    message: 'Producto no encontrado'
                });
            }

            prod_imagen = rows[0].prod_imagen;
        }

        const [result] = await conmysql.query(
            `UPDATE productos SET
            prod_codigo=?,
            prod_nombre=?,
            prod_stock=?,
            prod_precio=?,
            prod_activo=?,
            prod_imagen=?
            WHERE prod_id=?`,
            [
                prod_codigo,
                prod_nombre,
                stockFinal,
                precioFinal,
                activoFinal,
                prod_imagen,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

        const [rows] = await conmysql.query(
            'SELECT * FROM productos WHERE prod_id=?',
            [id]
        );

        res.json(rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor'
        });
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