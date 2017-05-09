var service = require('../tokenAut');
var models = require('../models/index');
var servidor = require('../../Servidor/servidor');
//uso de hilos de ejecucion
var events  = require('events');
var channel = new events.EventEmitter();


channel.on('armarSesionAdmin', function(perfil){
  servidor.addAdmin(perfil);
  console.log('----ADMIN CONECTADO----');
});

module.exports = function(app){
  //guardar registro
  app.post('/api/autenticar/', function(req, res) {
    var admin = {"nombre":"admin","clave":"1234"};
    var usuario;
    if(req.body.tipo == "admin"){
      usuario = admin;
      if(usuario.clave === req.body.clave){
        usuario.token = service.createToken(usuario);
        channel.emit('armarSesionAdmin',usuario);
        return res
            .status(200)
            .send({
              user:admin,
              success:1
            });
      }else{
        return res
          .status(200)
          .send({
            success:0
          });
      }
    }else{
      models.cliente.findOne({
        where:{
          $or:[
            {email:req.body.field},
            {documento:req.body.field}
          ]
        }
      })
        .then(function(usuario){
          if(usuario.clave === req.body.clave){
            var usuario = {
              "nombre":cliente.dataValues.nombre,
              "documento":cliente.dataValues.documento,
              "id":cliente.dataValues.id,
              "email":cliente.dataValues.email
            };
            usuario.token = service.createToken(usuario);
            cliente.dataValues.token = usuario.token;
            return res
                .status(200)
                .send({
                  user:usuario,
                  success:1
                });
          }else{
            return res
              .status(200)
              .send({
                success:0
              });
          }
        });
    }
  });
};
