var service = require('../tokenAut');
var models = require('../models/index');
var servidor = require('../../Servidor/servidor');
var crypto = require('crypto');
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
      models.sequelize.query('SELECT r.*,i.id_imagen,i.ruta as imagen_ruta FROM '+req.body.tipo+' r '+
                      ' left join imagen_'+req.body.tipo+' ir on r.id_'+req.body.tipo+' = ir.id_'+req.body.tipo+' AND ir.estado = '+"'A'"+
                      ' left join imagen i on ir.id_imagen = i.id_imagen  '+
                      " where r.documento ='"+req.body.field+"' or r.email ='"+req.body.field+"'",
        { model:models[req.body.tipo]}
      )
        .then(function(registro){
          registro = registro[0];
          if(registro){
            var pass = crypto.createHmac('sha1',registro.dataValues.email).update(req.body.clave).digest('hex');
            if(registro.dataValues.clave === pass){
              var usuario = {
                "nombre":registro.dataValues.nombre,
                "documento":registro.dataValues.documento,
                "id":registro.dataValues['id_'+req.body.tipo],
                "email":registro.dataValues.email,
                "tipo":req.body.tipo
              };
              if(registro.dataValues.id_imagen){
                usuario.avatar={
                  "id":registro.dataValues.id_imagen,
                  "ruta":registro.dataValues.imagen_ruta
                }
              }
              usuario.token = service.createToken(usuario);
              servidor.addUsuario(usuario);
              servidor.mostrarListaUsuarios();
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
