var modelo = require("./clsCliente");
module.exports = function(app){
  app.post('/api/cliente/', function(req, res) {
    
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
