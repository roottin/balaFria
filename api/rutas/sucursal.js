var models = require('../models/index');

module.exports = function(app){
  //obtener sucursales
  app.get('/api/sucursales/:id', function(req, res) {
    models.sucursal.find({
       where: {
        id_proveedor: req.params.id
      }
    })
      .then(function(sucursales) {
        res.json(sucursales);
      });
  });
  //guardar registro
  app.post('/api/sucursal', function(req, res) {
    models.sucursal.create({
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      id_proveedor: req.body.id_proveedor
    })
    .then(function(sucursal){
        Promise.all(req.body.rubros.map(function(rubro){
          return models.sucursal_rubro.create({
            id_sucursal: sucursal.id_sucursal,
            id_rubro: rubro.id_rubro
          });
        })).then(function(resultado){
          res.json(sucursal);
        });
    });
  });
  //buscar uno solo
  app.get('/api/sucursal/:id', function(req, res) {
    models.sucursal.find({
      where: {
        id_sucursal: req.params.id
      }
    }).then(function(sucursal) {
      res.json(sucursal);
    });
  });
  //modificar
  app.put('/api/sucursal/:id', function(req, res) {
    models.sucursal.find({
      where: {
        id_sucursal: req.params.id
      }
    }).then(function(sucursal) {
      if(sucursal){
        sucursal.updateAttributes({
          id_sucursal: req.body.id_sucursal,
          nombre: req.body.nombre,
          documento: req.body.descripcion
        }).then(function(sucursal) {
          res.send(sucursal);
        });
      }
    });
  });
  // delete a single sucursal
  app.delete('/api/sucursal/:id', function(req, res) {
    models.sucursal.destroy({
      where: {
        id_sucursal: req.params.id
      }
    }).then(function(sucursal) {
      res.json(sucursal);
    });
  });
};
