'use strict'
// Para usar las rutas de express
var express = require('express');
// Cargar el controlador
var ArticleController = require('../controllers/article');
// LLamar al router con el metodo router que trae express
var router = express.Router();

var multipart = require('connect-multiparty');
// Midelware que nos da el connect multiparty
var md_upload = multipart({ uploadDir: './upload/articles' });
// Ahora ya podemos crear rutas
//Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);
//Rutas utiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
//Aplicamos el middleware
router.post('/upload-img/:id', md_upload, ArticleController.upload);
router.get('/get-img/:img', ArticleController.getImg);
router.get('/search/:search', ArticleController.search);
//Exportar para poder usarlo en el app
module.exports = router;