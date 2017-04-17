var models = require('../models/index');
module.exports = function(app){
  //obtener proveedores
  app.get('/api/proveedores', function(req, res) {
    models.proveedor.findAll({}).then(function(proveedores) {
      res.json(proveedores);
    });
  });
  //guardar registro
  app.post('/api/proveedores', function(req, res) {
    models.proveedor.create({
      id_proveedor: req.body.id_proveedor,
      nombre: req.body.nombre,
      documento: req.body.documento
    }).then(function(proveedor) {
      res.json(proveedor);
    });
  });
  //buscar uno solo
  app.get('/api/proveedor/:id', function(req, res) {
    models.proveedor.find({
      where: {
        id_proveedor: req.params.id
      }
    }).then(function(proveedor) {
      res.json(proveedor);
    });
  });
  //modificar
  app.put('/api/proveedor/:id', function(req, res) {
    models.proveedor.find({
      where: {
        id_proveedor: req.params.id
      }
    }).then(function(proveedor) {
      if(proveedor){
        proveedor.updateAttributes({
          id_proveedor: req.body.id_proveedor,
          nombre: req.body.nombre,
          documento: req.body.documento
        }).then(function(proveedor) {
          res.send(proveedor);
        });
      }
    });
  });
  // delete a single proveedor
  app.delete('/api/proveedor/:id', function(req, res) {
    models.proveedor.destroy({
      where: {
        id_proveedor: req.params.id
      }
    }).then(function(proveedor) {
      res.json(proveedor);
    });
  });
};
