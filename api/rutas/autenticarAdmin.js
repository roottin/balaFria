var service = require('../tokenAut');
var servidor = require('../../Servidor/servidor');
//uso de hilos de ejecucion
var events  = require('events');
var channel = new events.EventEmitter();

channel.on('armarSesion', function(perfil){
  servidor.addAdmin(perfil);
});

module.exports = function(app){
  //guardar registro
  app.post('/api/autenticarAdmin/', function(req, res) {
    var admin = {"nombre":"admin","clave":"1234"};
    if(admin.clave === req.body.clave){
      admin.token = service.createToken(admin);
      channel.emit('armarSesion',admin);
      return res
          .status(200)
          .send(admin);
    }
  });
};
