//se hace el llamdo a la conexion con la base de datos
//var connection = require('../Core/Core');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');
var utils = require('../utils');
//creamos un objeto para ir almacenando todo lo que necesitemos
var modelo = {};

modelo.innerData = [];

modelo.setData = function(outData){
	if(outData.clave){
		outData.clave=modelo.encriptarPass(outData.clave,outData.cliente);
	}
	modelo.innerData=outData;
	return Promise.resolve();
};

modelo.getData = function(){
	return Promise.resolve(modelo.innerData);
};

modelo.encriptarPass = function(pass,key){
	//pass = crypto.createHmac('sha1',key).update(pass).digest('hex');
	return pass;
};
modelo.gestionar = function(pet,res){
	var yo = this;
	var reqData = {};
	var respuesta;
	this.setData(pet);
	switch(pet.operacion){
		case 'accesar':
			yo.accesar()
				.then(function(resultado){
					utils.enviar(resultado,res);
				},function(error){
					console.error(error,'linea 23');
				});
		break;
	}
};
modelo.buscar = function(){
	return new Promise(function(resolve,reject){
		if (connection)
		{
			var sql = 'SELECT * FROM cliente WHERE nombre = $1 or email = $1';
			query = connection.query(sql,[modelo.innerData.cliente]);
			query.on('row',function(result){
				resolve(result);
			});
		}else{
			data={
				"mensaje":"'no existe conexion'",
				"success":"0"
			};
			reject();
		}
	});
};

modelo.accesar = function(){
	return new Promise(function(resolve,reject){
		if (connection)
		{
			var sql = 'SELECT * FROM cliente  WHERE nombre = $1 or email = $1';
			var query = connection.query(sql,[modelo.innerData.cliente]);

			query.on('row',function(result){
				var data;
				if(!result)
				{
					data={
						"mensaje":"cliente no existe",
						"success":"0"
					};
					reject(data);
				}else{
					if(result.clave==modelo.innerData.clave){
						data={
							"mensaje":"acceso realizado con exito",
							"success":"1",
							"HoraCon": obtenerHoraActual(),
							"perfil" : result
						};
						data.perfil.clave = "";
						resolve(data);
					}else{
						data={
							"mensaje":"cliente/contraseña no concuerda",
							"success":"0"
						};
						reject(data);
					}
				}
			});

			query.on('error',function(error){
				reject(error);
			});
			query.on('end',function(result){
				reject({
					"mensaje":"cliente NO EXISTE",
					"success":0
				});
			});
		}else{
			data={
				"mensaje":"'no existe conexion'",
				"success":0
			};
			reject(data);
		}
	});
};

modelo.registrar = function(){
	return new Promise(function(resolve,reject){
		if(connection){
			var data = [modelo.innerData.cliente,modelo.innerData.clave];
			connection.query("INSERT INTO cliente (nombreusu,clave_usu) values ($1,$2)", data, function(error, result){
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		}
	});
};
function obtenerHoraActual () {
  now = new Date();
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return hour + ":" + minute + ":" + second;
}
module.exports = modelo;
