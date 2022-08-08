const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./db/config');
const cors = require('cors');

//* Crear el Servidor de Express
const app = express();

//*Base de Datos
dbConnection();

//*CORS
app.use(cors());

//*Directorio Publico
app.use( express.static('public') );

//*Parseo del Body
app.use( express.json() );

//*Paths req request res respuesta
//TODO auth/ crear login renew
app.use( '/api/auth', require('./routes/auth') );

//TODO CRUD Eventos
app.use( '/api/events', require('./routes/events') );

//TODO Esto es en caso de que no existe la peticion
app.get('*', ( req, res) => {
    res.sendFile( __dirname + '/public/index.html');
});

//*Escuchar peticiones
app.listen( process.env.PORT , () => {
    console.log(`Servidor corriendo en Puerto ${ process.env.PORT }`);
});