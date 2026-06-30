import { conmysql } from '../db.js'; // Ajusta la ruta a tu conexión

export const guardarPedido = async (req, res) => {
    const conexion = await conmysql.getConnection();
    try {
        await conexion.beginTransaction();

        const {
            cli_identificacion,
            cli_nombre,
            cli_telefono,
            cli_correo,
            cli_direccion,
            cli_pais,
            cli_ciudad,
            usr_id,
            detalle
        } = req.body;

        let cli_id;

        // 1. Buscar si el cliente ya existe por su cédula/identificación
        const [clienteExiste] = await conexion.query(
            'SELECT cli_id FROM cliente WHERE cli_identificacion = ?',
            [cli_identificacion]
        );

        if (clienteExiste.length > 0) {
            cli_id = clienteExiste[0].cli_id;
        } else {
            // 2. Si no existe, lo registramos automáticamente
            const [nuevoCliente] = await conexion.query(
                `INSERT INTO cliente 
                (cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad]
            );
            cli_id = nuevoCliente.insertId;
        }

        // 3. Insertar la cabecera del Pedido (ped_fecha se autogenera con NOW() o la que envíes)
        const [nuevoPedido] = await conexion.query(
            'INSERT INTO pedido (cli_id, usr_id, ped_fecha, ped_estado) VALUES (?, ?, NOW(), 1)',
            [cli_id, usr_id || 1]
        );
        const ped_id = nuevoPedido.insertId;

        // 4. Insertar los detalles del pedido en bucle
        for (const item of detalle) {
            await conexion.query(
                'INSERT INTO detalle_pedido (ped_id, prod_id, det_cantidad, det_precio) VALUES (?, ?, ?, ?)',
                [ped_id, item.prod_id, item.det_cantidad, item.det_precio]
            );
        }

        await conexion.commit();
        res.status(201).json({
            status: true,
            mensaje: "Pedido y cliente procesados correctamente",
            ped_id,
            cli_id
        });

    } catch (error) {
        await conexion.rollback();
        console.error(error);
        res.status(500).json({
            status: false,
            mensaje: "Error interno al procesar el pedido",
            error: error.message
        });
    } finally {
        conexion.release();
    }
};