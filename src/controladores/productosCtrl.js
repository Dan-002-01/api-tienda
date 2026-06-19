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
   INSERTAR PRODUCTO
========================= */
export const postProducto = async (req, res) => {
    try {
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo
        } = req.body;

        const prod_imagen = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        // validar código duplicado
        const [fila] = await conmysql.query(
            'SELECT * FROM productos WHERE prod_codigo=?',
            [prod_codigo]
        );

        if (fila.length > 0) {
            return res.status(409).json({
                id: 0,
                message: 'Producto con código ' + prod_codigo + ' ya está registrado'
            });
        }

        const [result] = await conmysql.query(
            `INSERT INTO productos
            (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                prod_codigo,
                prod_nombre,
                prod_stock,
                prod_precio,
                prod_activo,
                prod_imagen
            ]
        );

        res.json({ prod_id: result.insertId });

    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/* =========================
   ACTUALIZAR PRODUCTO
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

        let prod_imagen = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        // si no hay nueva imagen, mantener la anterior
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
                prod_stock,
                prod_precio,
                prod_activo,
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
   ELIMINAR PRODUCTO
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