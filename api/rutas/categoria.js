var models = require('../models/index');
var fs = require('fs');
//configuracion subida de archivos

//ruta por defecto para categoria
var ruta  = './storage/categoria';

//multer
var Multer = require('multer');

var upload = Multer({storage: Multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, ruta);
    },
    filename: function (req, file, callback) {
      var datetimestamp = Date.now();
      var nombreArchivo = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
      callback(null, nombreArchivo);}
    })
}).single('file');



module.exports = function(app){
  //obtener categorias
  app.get('/api/categorias/:id_proveedor&:id_sucursal', function(req, res) {
    models.sequelize.query("SELECT c.*,i.ruta as imagen_ruta FROM categoria c "+
                            "join imagen_categoria ic on c.id_categoria = ic.id_categoria AND ic.estado = 'A' "+
                            "join imagen i on ic.id_imagen = i.id_imagen "  +
                            "where c.id_proveedor = "+req.params.id_proveedor+
                            "and c.id_categoria not in( " +
                              "select c.id_categoria FROM categoria c "+
                              "join detalle_menu dm on c.id_categoria =dm.id_categoria "+
                              "join menu_sucursal ms on dm.id_menu = ms.id_menu "+
                              "where ms.id_sucursal = "+req.params.id_sucursal+
                            ")",
      { model: models.categoria}
    )
      .then(function(categorias) {
        res.json(categorias);
      });
  });
  //guardar registro
  app.post('/api/categorias',upload, function(req, res) {
    models.categoria.create({
      titulo: req.body.titulo,
      id_proveedor:req.body.id_proveedor
    }).then(function(categoria) {
      models.imagen.create({
        nombre: req.file.filename,
        ruta: req.file.path,
        mimetype: req.file.mimetype
      }).then(function(imagen){
        models.imagen_categoria.create({
          id_categoria:categoria.id_categoria,
          id_imagen:imagen.id_imagen
        }).then(function(imagen_categoria){
          categoria.dataValues.imagen = imagen;
          models.detalle_menu.create({
            id_categoria:categoria.id_categoria,
            id_menu:req.body.id_menu,
            secuencia:req.body.secuencia
          }).then(function(){
            res.json(categoria);
          });
        });
      });
    });
  });
  //imagen registro
  app.post('/api/categorias/imagen',upload, function(req, res) {
    models.sequelize.query("update imagen_categoria set estado = 'I' where id_categoria="+req.body.id_categoria)
      .then(function(result){
        models.imagen.create({
          nombre: req.file.filename,
          ruta: req.file.path,
          mimetype: req.file.mimetype
        }).then(function(imagen){
          models.imagen_categoria.create({
            id_categoria:req.body.id_categoria,
            id_imagen:imagen.id_imagen
          }).then(function(imagen_categoria){
            res.json(imagen_categoria);
          });
        });
      })
  });
  //buscar uno solo
  app.get('/api/categoria/:id', function(req, res) {
    models.categoria.find({
      where: {
        id_categoria: req.params.id
      }
    }).then(function(categoria) {
      models.imagen_categoria.find({
        where:{
          id_categoria : req.params.id,
          estado : 'A'
        }
      }).then(function(imagen_categoria){
        models.imagen.find({
          where:{
            id_imagen: imagen_categoria.id_imagen
          }
        }).then(function(imagen){
          categoria.dataValues.imagen = imagen;
          res.json(categoria);
        });
      });
    });
  });
  //modificar
  app.put('/api/categoria/:id', function(req, res) {
    models.categoria.find({
      where: {
        id_categoria: req.params.id
      }
    }).then(function(categoria) {
      if(categoria){
        categoria.updateAttributes({
          id_categoria: req.body.id_categoria,
          titulo: req.body.titulo
        }).then(function(categoria) {
          models.sequelize.query("update detalle_menu set secuencia="+req.body.secuencia+" where id = "+req.body.id_detalle_menu)
            .then(function(){
              categoria.dataValues.secuencia=req.body.secuencia;
              res.send(categoria);
            })
        });
      }
    });
  });
  // delete a single categoria
  app.delete('/api/categoria/:id_menu&:id_categoria', function(req, res) {
    models.detalle_menu.find({
      where: {
        id_categoria: req.params.id_categoria,
        id_menu: req.params.id_menu
      }
    }).then(function(detalle) {
      models.detalle_categoria.destroy({
        where: {
          id_detalle_menu: detalle.id
        }
      }).then(function(result){
        detalle
          .destroy()
          .then(function(result){
            res.json(1);
          });
      })
    });
  });
};
