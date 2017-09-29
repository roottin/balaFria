var models = require('../models/index');

module.exports = function(app){
  //obtener rubros
  app.get('/api/notificacion/proveedor/:id', function(req, res) {
    models.notificacion_proveedor.find({
      where: {
        id_proveedor: req.params.id
      }
    })
      .then(function(notificaciones) {
        res.json({
          "success":1,
          "notificaciones":notificaciones
        });
      });
  });
  app.get('/api/notificacion/cliente/:id', function(req, res) {
    models.notificacion_cliente.find({
      where: {
        id_cliente: req.params.id
      }
    })
      .then(function(notificaciones) {
        res.json({
          "success":1,
          "notificaciones":notificaciones
        });
      });
  });
};
