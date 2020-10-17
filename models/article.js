'use strict'
//Para crear objetos con el modelo que configuramos
//Capa de abstraccion intermedia para trabajar con el tipo de dato que creamos, en este caso(article)
var mongoose = require('mongoose');
// Para utilizar el objeto de ste tipo shcema
var Schema = mongoose.Schema;
//Estructura del tipo que creamos(importante a mongoose definir el tipo de dato)
const ArticleSchema = new Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    img: String
});
// (nombre modelo,shcema)
module.exports = mongoose.model('Article', ArticleSchema);
// articles --> guarda documentos de este tipo y con esta estructura dentro de la coleccion