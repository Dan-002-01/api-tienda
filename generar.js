import bcrypt from 'bcryptjs';

const clave = await bcrypt.hash('1234',10);

console.log(clave);