var express = require('express');
var router = express.Router();
var cliente = require('../clases/clsCliente');
var proveedor= require('../clases/clsProveedor');
var utils = require('../utils');

router.post("/", function(req,res)
{
	//creamos un objeto con los datos a insertar del usuario
	var pet = req.body;
	if(pet.tipopet=="web"){
		switch(pet.entidad){
			case 'cliente':
				cliente.gestionar(pet,res);
				break;
			case 'proveedor':
				proveedor.gestionar(pet,res);
				break;

			default:
				var respuesta = {
					success: 0,
					msg: "entidad "+pet.entidad+" no soportada por esta aplicacion"
				};
				utils.enviar(respuesta,res);
				break;
		}

	}else if(pet.tipopet=="mobile"){

	}else{
		resp = {
			success: 0,
			msg: "error en tipo de peticion"
		};
		utils.enviar(resp,res);
	}
});

router.get('/',function(req,res,next){
	res.end("este es el motor");
});
module.exports = router;
