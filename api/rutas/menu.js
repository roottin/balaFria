var models = require('../models/index');


module.exports = function(app){
  //obtener menus de un proveedor
  app.get('/api/menus/:id', function(req, res) {
    models.menu.findAll({where:{"id_proveedor":req.params.id}}).then(function(menus) {
      res.json(menus);
    });
  });
  //guardar registro
  app.post('/api/menus', function(req, res) {
    models.menu.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion
    })
    .then(function(menu){
        res.json(menu);
    });
  });
  //buscar uno solo
  app.get('/api/menu/:id', function(req, res) {
    models.menu.find({
      where: {
        id_menu: req.params.id
      }
    }).then(function(menu) {
      res.json(menu);
    });
  });
  //modificar
  app.put('/api/menu/:id', function(req, res) {
    models.menu.find({
      where: {
        id_menu: req.params.id
      }
    }).then(function(menu) {
      if(menu){
        menu.updateAttributes({
          id_menu: req.body.id_menu,
          nombre: req.body.nombre,
          documento: req.body.descripcion
        }).then(function(menu) {
          res.send(menu);
        });
      }
    });
  });
  // delete a single menu
  app.delete('/api/menun/:id', function(req, res) {
    models.menu.destroy({
      where: {
        id_menu: req.params.id
      }
    }).then(function(menu) {
      res.json(menu);
    });
  });
};
