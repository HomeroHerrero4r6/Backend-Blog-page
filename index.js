'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;
// Forzar a que los metodos antiguos se desactiven
mongoose.set('useFindAndModify', false);
// A nivel de funcionamiento interno viene bien utilizar la siguiente linea. para evitar ciertos fallos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', { useNewUrlParser: true })
    .then(() => {
        console.log('La conexion a la base de datos se ha realizado correctamente!!');
        //Crear server y ponerme a escuchar peticiones HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:' + port);
        });
    });