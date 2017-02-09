var express = require('express');

//modelo o clase necesario para su conexion
var accessModel = require("../clases/clsAcceso");
var utils = require('../utils');

var corAcceso = {};

corAcceso.gestionar = function(pet,res){
	//mando la informacion a la clase para su utilizacion
	if((pet.operacion!="recuperarSession")&&(pet.operacion!="actualizarClave")){
		accessModel.setData(pet);
	}
	var reqData = {};
	var respuesta;
	switch(pet.operacion){
		case 'acceso':
			//realizo la busqueda para el acceso
			accessModel.acceder()
				.then(function(data){
					var respuesta = {};
						respuesta.session = {
							nombreusu: accessModel.innerData.usuario,
							HoraCon: data.HoraCon
						};
						respuesta.success = 1;
					respuesta.mensaje = data.msg;
					utils.enviar(respuesta,res);
				},function(data){
					utils.enviar(data,res);
				});
			break;

		case 'registro':
			accessModel.registrar()
				.then(function(data){
					if(data && data.rowCount)
					{
						console.log("registro realizado con exito");
						respuesta = {
							success: 1,
							mensaje: 'registro realizado con exito'
						};
					}
					else
					{
						console.log("error en el registro");
						respuesta = {
							success: 0,
							mensaje: 'Error interno del servidor'
						};
					}
					utils.enviar(respuesta,res);
				},function(data){
					utils.error(data.mensaje,'corAcceso linea:55',res);
				});
			break;

		case 'datosPer':
			accessModel.buscar()
			.then(function(data){
				if(data.success=='1')
				{
					var formData=accessModel.getData();
					respuesta = {
						usuario:{
							Nombre: formData.nombre,
							Apellido: formData.apellido,
							Email: formData.email,
							Seudonimo: formData.seudonimo
						},
						success: 1,
						mensaje: data.msg
					};
				}
				else
				{
					respuesta = {
						success: 0,
						mensaje: data.msg
					};
				}
				utils.enviar(respuesta,res);
			},function(error){utils.error(error,'corAcceso linea:85',res);});
			break;

		case "actualizarDatos":
			console.log("peticion de actualizacion obtenida");
			reqData = {
				nombreusu : req.body.nombreusu,
				nombre : req.body.Nombre,
				apellido : req.body.Apellido,
				email : req.body.Email,
				seudonimo : req.body.Seudonimo
			};
			accessModel.setData(reqData);
			accessModel.actualizarDatos(function(error,data){
				var respuesta ={
					success: data.success,
					msg: data.msg
				};
				utils.enviar(respuesta,res);
			});
			break;

		case "actualizarClave":
			reqData = {
				nombreusu : req.body.Nombre,
				clave_usu : req.body.Pass,
				newClave : accessModel.encriptarPass(req.body.NewClave,req.body.Nombre)
			};
			accessModel.setData(reqData);
			accessModel.actualizarClave(function(error,data){
				var respuesta = {
					success: data.success,
					mensaje: data.msg
				};
				utils.enviar(respuesta,res);
			});
			break;

		case "seguir":
			reqData = {
				nombreusu : req.body.nombreusu,
				parametro : req.body.Parametro
			};

			console.log(reqData);
			accessModel.setData(reqData);
			accessModel.seguir(function(error, data){

				var success=(data.affectedRows!="0")?1:0;

				var respuesta = {
					success: data.success,
					action: data.action
				};
				utils.enviar(respuesta,res);
			});
			break;

		default:
			respuesta = {
				success: 0,
				mensaje: 'operacion '+pet.operacion+' no soportada por esta entidad'
			};
			utils.enviar(respuesta,res);
	}
	return respuesta;
};

module.exports = corAcceso;
