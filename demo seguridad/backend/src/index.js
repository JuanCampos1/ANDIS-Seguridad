const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

// Cargar el archivo auth_config.json
const config = JSON.parse(fs.readFileSync('auth_config.json'));

// Middleware para validar el token
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.domain}/.well-known/jwks.json`,
  }),
  audience: config.audience,
  issuer: `https://${config.domain}/`,
  algorithms: ['RS256'],
});

// Ruta protegida que solo puede ser accedida con un token válido
app.get('/api/external', checkJwt, (req, res) => {
  res.send({
    message: 'Token válido, acceso concedido a la API.',
  });
});

// Ruta en caso de error de autenticación
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Token inválido o no proporcionado.');
  }
});

app.listen(3001, () => {
  console.log('Backend escuchando en http://localhost:3001');
});
