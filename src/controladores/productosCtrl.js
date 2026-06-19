import { conmysql } from '../db.js';

export const getProductos = async(req,res)=>{

    try{

        const [result] =
        await conmysql.query(
            'SELECT * FROM productos'
        );

        res.json(result);

    }catch(error){

        return res.status(500).json({
            message:'Error al consultar productos'
        });

    }

};
//funcion para insertar un nuevo producto
export const postProducto = async (req, res) => {
    try {
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;//capturar la imagenque se nvia desde un formulario
        console.log("Datos del producto:", req.body);  // Verifica req.body
        console.log("Archivo de imagen:", req.file);   // Verifica req.file
        //validar que no se repita la código
        const [fila] = await conmysql.query('Select * from productos where prod_codigo=?', [prod_codigo])
        if (fila.length > 0) return res.status(404).json({
            id: 0, // Considerar usar 409 Conflict para recursos duplicados
            id:0,
            messge: 'Producto con código: ' + prod_codigo + ' ya está registrado'
        })

        const [result] = await conmysql.query(
            "INSERT INTO productos(prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?,?)",
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
        );
        res.send({ prod_id: result.insertId })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}

//función para actualizar un pedido existente
export const putProducto = async (req, res) => {
    try {
        // res.send('modificado cliente')
        const { id } = req.params
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body
        //const prod_imagen=null;
        let prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;//capturar la imagenque se nvia desde un formulario
        // Si no hay nueva imagen, recuperamos la actual desde la BD
       // Solo buscar en la BD si no se envió una nueva imagen
       if (!req.file) {
        const [rows] = await conmysql.query(
        'SELECT prod_imagen FROM productos WHERE prod_id = ?',
        [id]
       );
 // Si el producto existe, conservar su imagen actual
      if (rows && rows.length > 0) {
        prod_imagen = rows[0].prod_imagen;
      } else {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
     
    }
//res.json(prod_imagen)
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? where prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({
            messge: 'Productos no encontrado'
        })
        const [rows] = await conmysql.query('Select * from productos where prod_id=?', [id])
        res.json(rows[0])
        
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' })
    }
}

export const deleteProducto = async(req,res)=>{

    try{

        const {id}=req.params;

        const [result] =
        await conmysql.query(
            'DELETE FROM productos WHERE prod_id=?',
            [id]
        );

        if(result.affectedRows===0){

            return res.status(404).json({
                message:'Producto no encontrado'
            });

        }

        res.json({
            message:'Producto eliminado'
        });

    }catch(error){

        return res.status(500).json({
            message:'Error servidor'
        });

    }

};