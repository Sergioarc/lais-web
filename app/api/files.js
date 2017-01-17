/*
API para manejo de archivos que se suben al servidor

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
POST   http://localhost:8080/api/files
DELETE http://localhost:8080/api/files/1234567890
*/

// Dependencias
var express = require('express');
var router = express.Router(); // para modularizar las rutas
var fs = require('fs'); // File system utility
var multipart = require('connect-multiparty'); // connect middleware (upload handler)
var verifyToken = require('./token'); // Función de verificación de token
var multipartMiddlewarePublicaciones = multipart({uploadDir: './public/files/publicaciones'}); // definir ruta para archivos

// Función a realizar siempre que se utilize esta API
router.use(function(req, res, next){
    console.log('Usando el API Files.');
    // Rutas que son excluidas de verificación de token:
    if(req.method === 'GET')
        return next();
    // Antes de usar el API de usuario se verifica que haya token y sea válido
    verifyToken(req, res, next);
});

// En peticiones a la raiz del API
router.route('/publicaciones')
	// Obtener todos los archivos
	.post(multipartMiddlewarePublicaciones, function(req, res){
		//console.log("  req.body", req.body); // Datos adicionales enviados
		console.log("Información de archivos");
		console.log(req.files);
		for(var i in req.files.file){ // iterar en todos los archivos
			fs.rename(req.files.file[i].path, 'public/files/publicaciones/' + req.files.file[i].name, function(err){ // renombrar archivo (usar el nombre original)
				if(err)
					throw err;
			})
		}
		res.send({ // responder al cliente 
			success: true,
			message: 'Archivos subidos al servidor exitosamente',
			location: 'files/publicaciones'
		});
	})

	.delete(function(req, res){
        // Verificar si el archivo existe
		fs.access('public/files/publicaciones/' + req.params.filename, fs.constants.F_OK, function(err){
			if(err) // Error si el archivo que se quiere eliminar no existe
				return res.status(404).send({
					success: false,
					message: "File " + req.params.filename + " don't exist"
				});
			// Eliminar el archivo (indicando la ruta)
			fs.unlink('public/files/publicaciones/' + req.params.filename, function(err){
				if(err)
					throw err;
				res.send({
					success: true,
					message: 'File ' + req.params.filename + ' deleted'
				});
			});
		});
    })

module.exports = router; // Exponer el API para ser utilizado en server.js