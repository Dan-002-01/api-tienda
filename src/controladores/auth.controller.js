import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { conmysql } from '../db.js';

export const login = async (req, res) => {

    try {

        const { usuario, password } = req.body;

        const [result] = await conmysql.query(
            'SELECT * FROM usuarios WHERE usr_usuario = ? AND usr_activo = 1',
            [usuario]
        );

        if (result.length === 0) {
            return res.status(401).json({
                message: 'Usuario no encontrado'
            });
        }

        const usuarioBD = result[0];

        const coincide = await bcrypt.compare(
            password,
            usuarioBD.usr_clave
        );

        if (!coincide) {
            return res.status(401).json({
                message: 'Clave incorrecta'
            });
        }

        const token = jwt.sign(
            {
                id: usuarioBD.usr_id,
                usuario: usuarioBD.usr_usuario,
                nombre: usuarioBD.usr_nombre
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            message: 'Login correcto',
            token,
            usuario: {
                id: usuarioBD.usr_id,
                nombre: usuarioBD.usr_nombre,
                usuario: usuarioBD.usr_usuario
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Error en servidor'
        });

    }
};