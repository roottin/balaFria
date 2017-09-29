var models = require('../models/index');

var models = require('../models/index');
module.exports = function(app){
  //obtener paises
  app.get('/api/paises', function(req, res) {
    models.pais.findAll({}).then(function(paises) {
      Promise.all(paises.map(pais => {
        return models
          .coordenada
          .find({
            where:{
              id_coordenada:pais.id_coordenada
            }
          })
          .then(coordenada => {
            pais.dataValues.latlng = {
              lat:coordenada.latitud,
              lng:coordenada.longitud
            }
            return pais;
          })
      }))
      .then(paises => {
        res.json(paises);
      })
    });
  });
  //guardar registro
  app.post('/api/paises', function(req, res) {
    models
      .coordenada
      .create({
        latitud: req.body.latlng.lat,
        longitud: req.body.latlng.lng
      })
      .then(coordenada => {
        models.pais.create({
          nombre: req.body.nombre,
          codigo_postal: req.body.codigo_postal,
          id_coordenada: coordenada.id_coordenada
        })
        .then(function(pais){
            pais.dataValues.latlng = {
              lat:coordenada.latitud,
              lng:coordenada.lng
            }
            res.json(pais);
        });
      })
  });
  //buscar uno solo
  app.get('/api/pais/:id', function(req, res) {
    models.pais.find({
      where: {
        id_pais: req.params.id
      }
    }).then(function(pais) {
      models.coordenada
        .find({
          where:{
           id_coordenada:pais.id_coordenada
          }
        })
        .then(coordenada => {
          pais.dataValues.latlng = {
            lat:coordenada.latitud,
            lng:coordenada.lng
          }
          res.json(pais);
        })
    });
  });
  //modificar
  app.put('/api/pais/:id', function(req, res) {
    models.pais.find({
      where: {
        id_pais: req.params.id
      }
    }).then(function(pais) {
      if(pais){
        pais.updateAttributes({
          id_pais: req.body.id_pais,
          nombre: req.body.nombre,
          codigo_postal: req.body.codigo_postal
        }).then(function(pais) {
          res.send(pais);
        });
      }
    });
  });
  // delete a single pais
  app.delete('/api/pais/:id', function(req, res) {
    models.pais.destroy({
      where: {
        id_pais: req.params.id
      }
    }).then(function(pais) {
      res.json(pais);
    });
  });
};
