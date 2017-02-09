var express = require('express');

var utils = require('../utils');

var modelo = {};

modelo.gestionar = function(pet,res){
	var yo = this;
	var reqData = {};
	var respuesta;
	switch(pet.operacion){
		case 'listar':
			var resultado = yo.listar();
			if (resultado) {
				respuesta = {
					"success":1,
					"registros":resultado
				};
			}
		break;
	}
	utils.enviar(respuesta,res);
};

modelo.listar = function(){
	return [
		{
			"nombre":"Lalo Burguer",
			"rif":"j0000",
			"direccion":"la guajira"
		},{
			"nombre":"Pizzeria el Aguila",
			"rif":"j1111",
			"direccion":"avenida municipalidad"
		},{
			"nombre":"a que Memo",
			"rif":"j2222",
			"direccion":"calle del hambre el pilar"
		}
	];
};
module.exports = modelo;
