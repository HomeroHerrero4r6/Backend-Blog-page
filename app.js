'use strict'

//Cargar modulos de node para crear servidor
var express = require('express');//Crear servidor
var bodyParser = require('body-parser');//recibir peticiones y convertir a un objeto nativo de js
// Ejecutar express (http)
var app = express();//crear server

//Cargar ficheros rutas
var article_routes = require('./routes/article');

// Middlewares / se ejecuta antes de cargar la ruta

app.use(bodyParser.urlencoded({ extended: false }));//cargar body parser
app.use(bodyParser.json());//convertir cualquier tipo de peticion a JSON

// CORS / para permitir peticiones desde el frontend
// Configurar cabeceras y cors // Es un middleware 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Add prefijos a rutas/ cargar rutas
app.use('/api', article_routes);//Crear rutas y ponerle un prefijo de antes, es buena practica

//Ruta de prueba
// app.post('/probando', (req, res) => {
//     var hola = req.body.hola;
//     return res.status(200).send({
//         curso: 'frameworks',
//         autor: 'Homero',
//         url: 'www.homero.com',
//         hola
//     });
// })

// Exportar modulos (fichero-actual)
module.exports = app;