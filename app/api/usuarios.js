/*
API para manejo de la base de datos con la colección de "Usuarios"
Permite obtener datos en formato JSON mediante verbos HTTP (GET, POST, PUT, DELETE)

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
GET    http://localhost:8080/api/usuarios
POST   http://localhost:8080/api/usuarios
GET    http://localhost:8080/api/usuarios/1234567890
PUT    http://localhost:8080/api/usuarios/1234567890
DELETE http://localhost:8080/api/usuarios/1234567890
*/

// Dependencias
var express = require('express');
var router = express.Router(); // para modularizar las rutas
var Usuario = require('../models/usuario'); // Modelo de la colección "Usuarios"
var verifyToken = require('./token'); // Función de verificación de token

// Función a realizar siempre que se utilize esta API
router.use(function(req, res, next){
    // console.log('Usando el API de Usuarios.');
    
    // Rutas que son excluidas de verificación de token:
    if ((req.method === 'POST') && (req.originalUrl === '/api/usuarios/'))
        return next();
    
    // Antes de usar el API de usuario se verifica que haya token y sea válido
    verifyToken(req, res, next);
});

// obtener la información del usuario autentificado
router.get('/me', function(req, res){
    res.send(req.decoded);
});

// En peticiones a la raiz del API
router.route('/')
	// Obtener todos los usuarios
	.get(function(req, res){
        Usuario.find(function(err, usuarios){
            if(err)
                res.send(err);
            res.json(usuarios);
        })
    })

    // Agregar un nuevo usuario
    .post(function(req, res){
        var usuario = new Usuario();
        if(req.body.username)
            usuario.username = req.body.username;
        if(req.body.password)
            usuario.password = req.body.password;
        if(req.body.email)
            usuario.email = req.body.email;
        if(req.body.permisos)
            usuario.permisos = req.body.permisos;

        usuario.save(function(err){
            if(err){
                if(err.code == 11000)
                    return res.json({success: false, message: 'Un usuario con ese nombre ya existe'});
                else
                    return res.send(err);
            }

            res.json({message: 'Usuario creado'});
        });
    });

// En peticiones con un ID
router.route('/:usuario_id')
	// Obtener un usuario particular (mediante el ID)
    .get(function(req, res){
        Usuario.findById(req.params.usuario_id, function(err, usuario){
            if(err)
                res.send(err);
            res.json(usuario);
        })
    })

    // Actualizar un usuario en particular (mediante el ID)
    .put(function(req, res){
        Usuario.findById(req.params.usuario_id, function(err, usuario){
            if(err)
                res.send(err);
            
            // Actualizar todos los campos no-vacios
            if(req.body.username)
                usuario.username = req.body.username;
            if(req.body.password)
                usuario.password = req.body.password;
            if(req.body.email)
                usuario.email = req.body.email;
            if(req.body.permisos)
                usuario.permisos = req.body.permisos;
            

            usuario.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: 'Usuario actualizado'});
            });
        });
    })

    // Eliminar un usuario en particular (mediante el ID)
    .delete(function(req, res){
        Usuario.remove({
            _id: req.params.usuario_id
        }, function(err, usuario){
            if(err)
                res.send(err);
            res.json({message: 'Usuario borrado exitosamente'});
        });
    })

module.exports = router; // Exportar el API para ser utilizado en server.js