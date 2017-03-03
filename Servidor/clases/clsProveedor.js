var express = require('express');
var fs = require("fs");
var path = require('path');
var utils = require('../utils');

var modelo = {};

modelo.gestionar = function(pet,res){
	var yo = this;
	var reqData = {};
	var respuesta;
	switch(pet.operacion){
		case 'listar':
			yo.listar()
				.then(JSON.parse)
				.then(function(resultado){
					respuesta = {
						"success":1,
						"registros":resultado
					};
					utils.enviar(respuesta,res);
				},function(error){
					console.error(error,'linea 23');
				});
		break;
		case "buscarOpinion":
			yo.buscarOpinion()
				.then(JSON.parse)
				.then(function(resultado){
					respuesta = {
						"success":1,
						"registro":resultado
					};
					utils.enviar(respuesta,res);
				});
		break;
	}
};

modelo.listar = function(){
	return new Promise(function(resolve,reject){
		var ruta = path.join(__dirname, '../json/db_proveedor.json');
		fs.readFile(ruta, 'utf8', function(error,data){
			if(error){
				reject(error);
			}else{
				resolve(data);
			}
		});
	});
};
modelo.buscarOpinion = function(){
	return new Promise(function(resolve,reject){
		var ruta = path.join(__dirname, '../json/db_opinion.json');
		fs.readFile(ruta, 'utf8', function(error,data){
			if(error){
				reject(error);
			}else{
				resolve(data);
			}
		});
	});
};
module.exports = modelo;
