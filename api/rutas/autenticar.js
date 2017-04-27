var service = require('../tokenAut');
var servidor = require('../../Servidor/servidor');
//uso de hilos de ejecucion
var events  = require('events');
var channel = new events.EventEmitter();

channel.on('armarSesion', function(perfil){
  servidor.addUsuario(perfil);
  servidor.mostrarListaUsuarios();
});
channel.on('armarSesionAdmin', function(perfil){
  servidor.addAdmin(perfil);
  console.log('----ADMIN CONECTADO----');
});

module.exports = function(app){
  //guardar registro
  app.post('/api/autenticar/', function(req, res) {
    var admin = {"nombre":"admin","clave":"1234"};
    var users = [{"id":1,"nombre":"matthew","clave":"1234"}];
    var usuario;
    if(req.body.tipo == "admin"){
      usuario = admin;
    }else{
      users.forEach(function(each){
        if(each.nombre === req.body.nombre){
          usuario = each;
        }
      });
    }
    if(usuario.clave === req.body.clave){
      usuario.token = service.createToken(usuario);
      if(req.body.tipo == "admin"){
        channel.emit('armarSesionAdmin',usuario);
      }else{
        channel.emit('armarSesion',usuario);
      }
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
  });
};
