var models = require('../models/index');

var models = require('../models/index');
module.exports = function(app){
  //obtener ciudades
  app.get('/api/ciudades', function(req, res) {
    models.ciudad.findAll({}).then(function(ciudades) {
      res.json(ciudades);
    });
  });
  //guardar registro
  app.post('/api/ciudades', function(req, res) {
    models
      .coordenada
      .create({
        latitud: req.body.latlng.lat,
        longitud: req.body.latlng.lng
      })
      .then(coordenada => {
        models.ciudad.create({
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          zoom: req.body.zoom,
          id_coordenada: coordenada.id_coordenada,
          id_pais: req.body.id_pais
        })
        .then(function(ciudad){
            ciudad.dataValues.latlng = {
              lat:coordenada.latitud,
              lng:coordenada.lng
            }
            res.json(ciudad);
        });
      })
  });
  //buscar uno solo
  app.get('/api/ciudad/:id', function(req, res) {
    models.ciudad.find({
      where: {
        id_ciudad: req.params.id
      }
    }).then(function(ciudad) {
      models.coordenada
        .find({
          where:{
           id_coordenada:ciudad.id_coordenada
          }
        })
        .then(coordenada => {
          ciudad.dataValues.latlng = {
            lat:coordenada.latitud,
            lng:coordenada.lng
          }
          res.json(ciudad);
        })
    });
  });
  //modificar
  app.put('/api/ciudad/:id', function(req, res) {
    models.ciudad.find({
      where: {
        id_ciudad: req.params.id
      }
    }).then(function(ciudad) {
      if(ciudad){
        ciudad.updateAttributes({
          id_ciudad: req.body.id_ciudad,
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          zoom: req.body.zoom,
          id_pais: req.body.id_pais
        }).then(function(ciudad) {
          res.send(ciudad);
        });
      }
    });
  });
  // delete a single ciudad
  app.delete('/api/ciudad/:id', function(req, res) {
    models.ciudad.destroy({
      where: {
        id_ciudad: req.params.id
      }
    }).then(function(ciudad) {
      res.json(ciudad);
    });
  });
};
