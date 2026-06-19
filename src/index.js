import app from './app.js';
import {PORT} from './config.js';
app.listen(PORT, '0.0.0.0', () => {
  console.log("Servidor en puerto", PORT);
});//3000
console.log('Servidor está ejecutando en el puerto',PORT)
