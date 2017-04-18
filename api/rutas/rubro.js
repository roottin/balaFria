var models = require('../models/index');
var fs = require('fs');

module.exports = function(app){
  //obtener rubros
  app.get('/api/rubros', function(req, res) {
    models.rubro.findAll({}).then(function(rubros) {
      res.json(rubros);
    });
  });
  //guardar registro
  app.post('/api/rubros', function(req, res) {
    models.rubro.create({
      nombre: req.body.nombre,
    }).then(function(rubro) {
      var imageData = new Buffer(req.body.imagen.byteArray);
      models.imagen.create({
        nombre: req.body.imagen.nombre,
        archivo: imageData,
        content_type: req.body.imagen.content_type
      }).then(function(imagen){
        models.imagen_rubro.create({
          id_rubro:rubro.id_rubro,
          id_imagen:imagen.id_imagen
        }).then(function(imagen_rubro){
          rubro.dataValues.imagen = imagen;
          res.json(rubro);
        });
      });
    });
  });
  //buscar uno solo
  app.get('/api/rubro/:id', function(req, res) {
    models.rubro.find({
      where: {
        id_rubro: req.params.id
      }
    }).then(function(rubro) {
      models.imagen_rubro.find({
        where:{
          id_rubro : req.params.id,
          estado : 'A'
        }
      }).then(function(imagen_rubro){
        models.imagen.find({
          where:{
            id_imagen: imagen_rubro.id_imagen
          }
        }).then(function(imagen){
          rubro.imagen = imagen;
          res.json(rubro);
        });
      });
    });
  });
  //modificar
  app.put('/api/rubro/:id', function(req, res) {
    models.rubro.find({
      where: {
        id_rubro: req.params.id
      }
    }).then(function(rubro) {
      if(rubro){
        rubro.updateAttributes({
          id_rubro: req.body.id_rubro,
          nombre: req.body.nombre,
          documento: req.body.documento
        }).then(function(rubro) {
          res.send(rubro);
        });
      }
    });
  });
  // delete a single rubro
  app.delete('/api/rubro/:id', function(req, res) {
    models.rubro.destroy({
      where: {
        id_rubro: req.params.id
      }
    }).then(function(rubro) {
      res.json(rubro);
    });
  });
};
