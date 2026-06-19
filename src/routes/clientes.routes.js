import {Router} from 'express'
import {verificarToken} from '../middlewares/auth.js';
import {getClientes,getClientesxid,postInsertarCliente,putCliente,patchCliente,deleteCliente} from '../controladores/clientesCtrl.js'
const router=Router()
// armar nuestras rutas

router.get('/clientes',verificarToken,getClientes)

router.get('/clientes/:id',verificarToken,getClientesxid)

router.post('/clientes',verificarToken,postInsertarCliente)

router.put('/clientes/:id',verificarToken,putCliente)

router.patch('/clientes/:id',verificarToken,patchCliente)

router.delete('/clientes/:id',verificarToken,deleteCliente)
export default router