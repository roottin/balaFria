var models = require('../models/index');
var fs = require('fs');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');

var servidor = require('../../Servidor/servidor');
var service = require('../tokenAut');
module.exports = function(app){
  //guardar registro
  app.post('/api/cliente', function(req, res) {
    console.log(req.body);
    var pass = crypto.createHmac('sha1',req.body.correo).update(req.body.clave).digest('hex');
    models.cliente.create({
      "nombre": req.body.nombre,
      "apellido": req.body.apellido,
      "email": req.body.correo,
      "documento": req.body.documento,
      "clave": pass
    }).then(function(cliente){
      //creo la sesion del recien registrado
      var usuario = {
        "nombre":cliente.dataValues.nombre,
        "apellido":cliente.dataValues.apellido,
        "id":cliente.dataValues.id_cliente,
        "email":cliente.dataValues.email,
      };
      usuario.token = service.createToken(usuario);
      cliente.dataValues.token = usuario.token;
      servidor.addUsuario(usuario);
      servidor.mostrarListaUsuarios();
      //mando la respuesta
      res.json(cliente);
    });
  });
};
