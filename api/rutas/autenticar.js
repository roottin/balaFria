var service = require('../tokenAut');
var servidor = require('../../Servidor/servidor');
//uso de hilos de ejecucion
var events  = require('events');
var channel = new events.EventEmitter();

channel.on('armarSesion', function(perfil){
  servidor.addUsuario(perfil);
  servidor.mostrarListaUsuarios();
});

module.exports = function(app){
  //guardar registro
  app.post('/api/autenticar/', function(req, res) {
    var users = [{"id":1,"nombre":"matthew","clave":"1234"}];
    var usuario;
    users.forEach(function(each){
      if(each.nombre === req.body.nombre){
        usuario = each;
      }
    });
    if(usuario.clave === req.body.clave){
      usuario.token = service.createToken(usuario);
      channel.emit('armarSesion',usuario);
      return res
          .status(200)
          .send(usuario);
    }
  });
};
