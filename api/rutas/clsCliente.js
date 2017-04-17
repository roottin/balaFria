//se hace el llamdo a la conexion con la base de datos
var connection = require('../Core/Core');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');
var servidor = require("../../Servidor/servidor");
//uso de hilos de ejecucion
var events  = require('events');
var channel = new events.EventEmitter();

channel.on('armarSesion', function(perfil){
    servidor.addUsuario(perfil);
});

//creamos un objeto para ir almacenando todo lo que necesitemos
var modelo = {};

modelo.innerData = [];

modelo.setData = function(outData){
	if(outData.clave){
		outData.claveRaw=outData.clave;
		outData.clave=modelo.encriptarPass(outData.clave,outData.nombre);
	}
	modelo.innerData=outData;
	return Promise.resolve();
};

modelo.getData = function(){
	return Promise.resolve(modelo.innerData);
};

modelo.encriptarPass = function(pass,key){
	pass = crypto.createHmac('sha1',key).update(pass).digest('hex');
	return pass;
};
modelo.crearTokenKey = function(profile){
	var tokenKey = this.encriptarPass(profile.nombre,profile.clave);
	return tokenKey;
}
modelo.gestionar = function(pet,res){
	var yo = this;
	var reqData = {};
	var respuesta;
	this.setData(pet);
	switch(pet.operacion){
		case 'accesar':
			yo.accesar()
				.then(function(resultado){
					//utils.enviar(resultado,res);
				},function(error){
					console.log(error);
					//utils.error(error,38,res);
				});
			break;
			case 'registrar':
				yo.registrar()
					.then(function(resultado){
						if(resultado.rowCount){
							respuesta = {
								"success": 1,
								"registro":resultado.rows[0]
							}
							//utils.enviar(respuesta,res);
						}else{
							//utils.error(resultado,51,res);
						}
					},function(error){
						respuesta = {
							"success": 0,
							"registro": JSON.stringify(error)
						}
						console.error(error,'linea 51');
						//utils.error(respuesta,51,res);
					});
		break;
		default:
			resultado = {
				"success":0,
				"mensaje":"Operacion no permitida"
			};
			//utils.enviar(resultado,res);
	}
};
modelo.buscar = function(){
	return new Promise(function(resolve,reject){
		if (connection)
		{
			var sql = 'SELECT * FROM cliente WHERE nombre = $1 or email = $1';
			query = connection.query(sql,[modelo.innerData.nombre]);
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
			var sql = 'SELECT *,id_cliente as id FROM cliente  WHERE nombre = $1 or email = $1';
			var query = connection.query(sql,[modelo.innerData.nombre]);

			query.on('row',function(result){
				var data;
				if(!result)
				{
					data={
						"mensaje":"usuario no existe",
						"success":0
					};
					reject(data);
				}else{
					modelo.innerData.clave = modelo.encriptarPass(modelo.innerData.claveRaw,result.nombre);
					if(result.clave==modelo.innerData.clave){
						data={
							"mensaje":"acceso realizado con exito",
							"success":"1",
							"HoraCon": obtenerHoraActual(),
							"perfil" : result,
							"tokenKey":modelo.crearTokenKey(result)
						};
						data.perfil.clave = "";
						data.perfil.tipo = "cliente";
						channel.emit("armarSesion",data.perfil);
						resolve(data);
					}else{
						data={
							"mensaje":"usuario/contraseña no concuerda",
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
					"mensaje":"usuario NO EXISTE",
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
			var data = [modelo.innerData.nombre,modelo.innerData.apellido,modelo.innerData.clave,modelo.innerData.email];
			console.log(data);
			connection.query("INSERT INTO cliente (nombre,apellido,clave,email) values ($1,$2,$3,$4) RETURNING *", data, function(error, result){
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
