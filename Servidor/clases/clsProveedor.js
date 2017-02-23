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
			"direccion":"la guajira",
			"descripcion":"Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam interdum sed mi eget malesuada. Nunc commodo lorem nec felis mattis rutrum. In.",
			"puntuacion":"7.6",
			"lat":"9.55441727599",
			"lng":"-69.191708788",
			'img':'https://igx.4sqi.net/img/general/600x600/26790829_kXq_i2Jk1IF4cGL-M6QvjtNMRAUBynbz4lkAr6sOKcg.jpg'
		},{
			"nombre":"Pizzeria el Aguila",
			"rif":"j1111",
			"direccion":"avenida municipalidad",
			"descripcion":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus bibendum aliquam nulla at fermentum. Curabitur eu sapien id velit os. Quisque vitae tempor lorem",
			"puntuacion":"7.6",
			"lat":"9.579154",
			"lng":"-69.219986",
			"img":"https://pbs.twimg.com/profile_images/1161214461/LOGO_AGUILA_PIZZAS.JPG"
		},{
			"nombre":"a que Memo",
			"rif":"j2222",
			"direccion":"calle del hambre el pilar",
			"descripcion":"Morbi eget eros quis mauris interdum tempus sed sed nisl. Nunc dolor est, pretium et urna ut, finibus cursus est. Praesent ac accumsan mi.",
			"puntuacion":"7.6",
			"lat":"9.572159",
			"lng":"-69.209555",
			'img':'https://scontent.cdninstagram.com/t51.2885-19/s150x150/14478296_203976560055074_4562986007028301824_a.jpg'
		}
	];
};
module.exports = modelo;
