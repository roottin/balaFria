var service = require('../tokenAut');
var servidor = require('../../Servidor/servidor');
var db = require('../models/index');

module.exports = function(app){
  //conectados
  app.get('/api/adminPanel/clientes', function(req, res) {
    var conectados = servidor.get('cliente');
    db.cliente.findAll({})
      .then(function(resultado){
        servidor.admin.conexion.socket.emit('notificacion',{
          motivo:"registrados",
          tipo:"cliente",
          cantidad:resultado.length
        });
      });
    return res
        .status(200)
        .send({
          "clientes":{
            "conectados":conectados.length,
            "usuarios":conectados
          },
          success:1
        });
  });
  app.get('/api/adminPanel/proveedores', function(req, res) {
    var conectados =  servidor.get('proveedor');
    db.proveedor.findAll({})
      .then(function(resultado){
        servidor.admin.conexion.socket.emit('notificacion',{
          motivo:"registrados",
          tipo:"proveedor",
          cantidad:resultado.length
        });
      });
    return res
        .status(200)
        .send({
          "proveedores":{
            "conectados":conectados.length,
            "usuarios":conectados
          },
          success:1
        });
  });
};
