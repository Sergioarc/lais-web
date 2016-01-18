/*
API para manejo de la base de datos con la colección de "Eventos"
Permite obtener datos en formato JSON mediante verbos HTTP (GET, POST, PUT, DELETE)

Las rutas aqui definidas son un router que le antecede una ruta general de uso (ver server.js)
Por ejemplo:
GET    http://localhost:8080/api/eventos
POST   http://localhost:8080/api/eventos
GET    http://localhost:8080/api/eventos/1234567890
PUT    http://localhost:8080/api/eventos/1234567890
DELETE http://localhost:8080/api/eventos/1234567890
*/

// Dependencias
var express = require('express');
var router = express.Router(); // para modularizar las rutas
var Evento = require('../models/evento'); // Modelo de la colección "Eventos"

// Función a realizar siempre que se utilize esta API
router.use(function(req, res, next){
    console.log('Usando el API de Eventos.');
    next(); // Pasar el control de las rutas a la siguiente coincidencia
});

// En peticiones a la raiz del API
router.route('/')
	// Obtener todos los eventos
	.get(function(req, res){
        Evento.find(function(err, evento){
            if(err)
                res.send(err);
            res.json(evento);
        })
    })

    // Agregar un nuevo evento
    .post(function(req, res){
        var evento = new Evento();
        
        if(req.body.titulo)
        	evento.titulo = req.body.titulo;
        if(req.body.descripcion)
        	evento.descripcion = req.body.descripcion;
        if(req.body.contenidoHTML)
        	evento.contenidoHTML = req.body.contenidoHTML;
	    if(req.body.fecha)
	    	evento.fecha = req.body.fecha;
	    if(req.body.fechaFin)
	    	evento.fechaFin = req.body.fechaFin;
	    if(req.body.horario)
	    	evento.horario = req.body.horario;
	    if(req.body.horarioFin)
	    	evento.horarioFin = req.body.horarioFin;
	    if(req.body.todoElDia === 'true')
	    	evento.todoElDia = req.body.todoElDia === 'true';
	    if(req.body.tipo)
	    	evento.tipo = req.body.tipo;
	    // Se espera que las imagenes se representen como una lista de nombres de archivo separados por comas
	    if(req.body.imagen)
	    	evento.imagen = req.body.imagen.split(/\s*,\s*/); // REGEXP elimina posibles espacios en blanco entre nombres y comas
	    if(req.body.realizador)
	    	evento.realizador = req.body.realizador.split(/\s*,\s*/);
	    // "lugar" debería ser una colección aparte??
	    // if(req.body.lugar)
	    // 	evento.lugar = req.body.lugar; // id del lugar
	    evento.fechaCreacion = new Date(); // fecha de creación auto-actualizada

        evento.save(function(err){
            if(err)
                res.send(err);
            res.json({message: 'Evento creado'});
        })
    })

module.exports = router; // Exponer el API para ser utilizado en server.js