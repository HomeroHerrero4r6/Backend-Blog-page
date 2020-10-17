'use strict'
const { default: validator } = require('validator');
// var validator = require('validator');
//importar el modelo
var Article = require('../models/article');
// Para eliminar archivos del sistema de ficheros file system
const fs = require('fs');
const path = require('path');
const { exists } = require('../models/article');
//Definir el objrto y todos los metodos que va a tener
var controller = {
    datosCurso: (req, res) => {
        var hola = req.body.hola;
        return res.status(200).send({
            curso: 'Frameworks',
            autor: 'Victor',
            url: 'victor.com',
            hola
        });
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        });
    },
    //Permite crear un nuevo articulo
    save: (req, res) => {
        // recoger parametros con post
        var params = req.body;//Recoger los que nos llega por body
        console.log(params);
        // validar datos (Validator) sencible a que causen exepciones por eso usamos try,catch

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }
        if (validate_title && validate_content) {


            // crear objeto a guardar
            const article = new Article();
            // asignar valores
            article.title = params.title;
            article.content = params.content;
            article.img = null;

            // guardar el articulo 
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado!!'
                    });
                }
                // devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son correctos'
            });
        }
    },
    getArticles: (req, res) => {
        var query = Article.find({});
        // Para sacar los ultimos articulos, reutilizamos el mismo metodo en rutas con parametro opcional (?)
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        //find para sacar datos de la base de datos en find se puede poner todas las condiciones que querramos
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos'
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },
    getArticle: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;
        // Comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!!'
            });
        }
        // Buscar el articulo
        Article.findById(articleId, (err, article) => {
            if (err || !article) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No existe el articulo!!'
                });
            }
            // Devolver en JSON
            return res.status(404).send({
                status: 'success',
                article
            });
        })
    },
    // Actualizar Articulos
    update: (req, res) => {
        // Recoger el id del articulo que viene por la url
        var articleId = req.params.id;
        // Recoger los datos que llegan por put
        var params = req.body;
        // Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar!!'
            });
        }
        if (validate_title && validate_content) {
            // Find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo!!!'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articleUpdated
                });
            });
        } else {
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }
    },
    delete: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;
        // Find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, Posiblemenrte no exista!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },
    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/ article.js

        // Recoger el fichero de la peticion
        var file_name = 'Imagen no subida...';
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        // Usamos la \\ por que estoy en windows
        // *Advertencia en linux o mac*
        // var file_split = file_path.split('/');
        var file_split = file_path.split('\\');

        // Nombre del archivo 
        var file_name = file_split[2];

        // Extension del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];
        // comprobar la extension, solo imagenes, si no es valida => borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            // Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la img no es valida'
                });
            })

        } else {

            // si todo es valido // sacando el id de la url
            var articleId = req.params.id;

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({ _id: articleId }, { img: file_name }, { new: true }, (err, articleUpdated) => {

                if (err || !articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al guardar la img de articulo'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
    },// end upload file
    // Metodo para sacar la img del backend
    getImg: (req, res) => {
        var file = req.params.img;
        var path_file = './upload/articles/' + file;
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file))
            } else {

                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },
    // Buscador
    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;
        // Find or
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    });
                }
                if (!articles || articles.length <= 0) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });
    }
}; // end controller
module.exports = controller;