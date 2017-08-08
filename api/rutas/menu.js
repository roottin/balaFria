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
      descripcion: req.body.descripcion,
      id_proveedor: req.body.id_proveedor
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
      models.sequelize.query("select dm.*,c.*,i.*,dm.id as id_detalle_menu,dm.secuencia from detalle_menu dm "+
                              "join categoria c on dm.id_categoria = c.id_categoria "+
                              "join imagen_categoria ic on c.id_categoria = ic.id_categoria and ic.estado = 'A' "+
                              "join imagen i on ic.id_imagen =i.id_imagen "+
                              "where dm.id_menu = "+req.params.id+
                              ' order by dm.secuencia',
        { model: models.detalle_menu}
      ).then(result =>{
        menu.dataValues.categorias = [];
        Promise.all(result.map(categoria => {
          return models.sequelize.query("select p.*,i.ruta,dc.secuencia, dc.id as id_detalle_categoria,pp.valor as precio from detalle_categoria dc"+
                            " join producto p on dc.id_producto = p.id_producto"+
                            " join imagen_producto ip on ip.id_producto = p.id_producto and ip.estado = 'A'"+
                            " join imagen i on ip.id_imagen = i.id_imagen"+
                            " join producto_precio pp on pp.id_producto_precio = (select id_producto_precio from producto_precio where id_producto = p.id_producto and fecha_final is null )"+
                            " where id_detalle_menu ="+categoria.dataValues.id_detalle_menu+
                            ' order by dc.secuencia',
            { model: models.detalle_categoria}
          ).then(productos => {
            categoria.dataValues.productos = productos;
            menu.dataValues.categorias.push(categoria);
          })
        })).then(result => {
          res.json(menu);
        });
      });
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
          nombre: req.body.nombre,
          descripcion: req.body.descripcion
        }).then(function(menu) {
          res.send(menu);
        });
      }
    });
  });
  // delete a single menu
  app.delete('/api/menu/:id', function(req, res) {
    models.menu.destroy({
      where: {
        id_menu: req.params.id
      }
    }).then(function(menu) {
      res.json(menu);
    });
  });
  //asociar categoria a menu
  app.put('/api/menus/cambiarCategoria', function(req, res) {
    models.menu_sucursal.find({where:{id_sucursal:req.body.id_sucursal}})
    .then(function(menu_sucursal){
      models.detalle_menu.create({
        id_categoria: req.body.id_categoria,
        id_menu: menu_sucursal.id_menu
      })
      .then(function(){
          res.json(1);
      });
    })
  });
  //asociar categoria a menu
  app.put('/api/menus/cambiarProducto', function(req, res) {
      models.detalle_categoria.create({
        id_detalle_menu: req.body.id_detalle_menu,
        id_producto: req.body.id_producto
      })
      .then(function(menu){
          res.json(menu);
      });
  });
};
