dels = require('../models/index');

var models = require('../models/index');
module.exports = function(app){
  //obtener favoritos de un cliente
  app.get('/api/favorito/cliente/:id', function(req, res) {
    models.favorito.findAll({where:{id_cliente:req.params.id}}).then(function(favoritos) {
      res.json(favoritos);
    });
  });
  //obtener clientes que tienen como favorito esta sucursal
  app.get('/api/favorito/sucursal/:id', function(req, res) {
    models.favorito.findAll({where:{id_sucursal:req.params.id}}).then(function(favoritos) {
      res.json(favoritos);
    });
  });
  //guardar registro
  app.post('/api/favoritos', function(req, res) {
    models.favorito.create({
      id_cliente:req.body.id_cliente,
      id_sucursal:req.body.id_sucursal
    })
    .then(function(favoritos){
        res.json(favoritos);
    });
  });
  // delete a single favoritos
  app.delete('/api/favorito/:id', function(req, res) {
    models.favorito.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(favoritos) {
      res.json(favoritos);
    });
  });
};