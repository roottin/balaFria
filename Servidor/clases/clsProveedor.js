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
			"id":'01',
			"nombre":"Lalo Burguer",
			"rif":"j0000",
			"direccion":"la guajira",
			"descripcion":"Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam interdum sed mi eget malesuada. Nunc commodo lorem nec felis mattis rutrum. In.",
			"puntuacion":"3.3",
			"lat":"9.55441727599",
			"lng":"-69.191708788",
			'img':'lalo.jpg',
			"contacto":[
				{'tipo':"telefono","valor":"0416-0566555"},
			]
		},{
			"id":'02',
			"nombre":"Pizzeria el Aguila",
			"rif":"j1111",
			"direccion":"avenida municipalidad",
			"descripcion":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus bibendum aliquam nulla at fermentum. Curabitur eu sapien id velit os. Quisque vitae tempor lorem",
			"puntuacion":"4.8",
			"lat":"9.579154",
			"lng":"-69.219986",
			"img":"pizzaAguila.jpg",
			"contacto":[
				{'tipo':"telefono","valor":"0412-0566755"},
				{'tipo':"telefono","valor":"0416-3216755"},
				{'tipo':"telefono","valor":"0412-2363185"},
			]
		},{
			"id":'03',
			"nombre":"a que Memo",
			"rif":"j2222",
			"direccion":"calle del hambre el pilar",
			"descripcion":"Morbi eget eros quis mauris interdum tempus sed sed nisl. Nunc dolor est, pretium et urna ut, finibus cursus est. Praesent ac accumsan mi.",
			"puntuacion":"3.9",
			"lat":"9.572159",
			"lng":"-69.209555",
			'img':'a_que_memo.jpg',
			"contacto":[
				{'tipo':"telefono","valor":"0412-7689002"},
				{'tipo':"telefono","valor":"0424-0565785"},
			]
		}
	];
};
module.exports = modelo;
