var models = require('../models/index');
var fs = require('fs');
//configuracion subida de archivos

//ruta por defecto para producto
var ruta  = './storage/producto';

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
  //obtener productos
  app.get('/api/productos', function(req, res) {
    models.sequelize.query('SELECT r.*,i.ruta as imagen_ruta FROM producto r '+
                    ' join imagen_producto ir on r.id_producto = ir.id_producto AND ir.estado = '+"'A'"+
                    ' join imagen i on ir.id_imagen = i.id_imagen  ',
      { model: models.producto}
    )
      .then(function(productos) {
        res.json(productos);
      });
  });
  //guardar registro
  app.post('/api/productos',upload, function(req, res) {
    models.producto.create({
      titulo: req.body.titulo,
      id_proveedor:req.body.id_proveedor
    }).then(function(producto) {
      models.imagen.create({
        nombre: req.file.filename,
        ruta: req.file.path,
        mimetype: req.file.mimetype
      }).then(function(imagen){
        models.imagen_producto.create({
          id_producto:producto.id_producto,
          id_imagen:imagen.id_imagen
        }).then(function(imagen_producto){
          producto.dataValues.imagen = imagen;
          models.detalle_menu.create({
            id_producto:producto.id_producto,
            id_menu:req.body.id_menu
          }).then(function(){
            res.json(producto);
          });
        });
      });
    });
  });
  //imagen registro
  app.post('/api/productos/imagen',upload, function(req, res) {
    models.sequelize.query("update imagen_producto set estado = 'I' where id_producto="+req.body.id_producto)
      .then(function(result){
        models.imagen.create({
          nombre: req.file.filename,
          ruta: req.file.path,
          mimetype: req.file.mimetype
        }).then(function(imagen){
          models.imagen_producto.create({
            id_producto:req.body.id_producto,
            id_imagen:imagen.id_imagen
          }).then(function(imagen_producto){
            res.json(imagen_producto);
          });
        });
      })
  });
  //buscar uno solo
  app.get('/api/producto/:id', function(req, res) {
    models.producto.find({
      where: {
        id_producto: req.params.id
      }
    }).then(function(producto) {
      models.imagen_producto.find({
        where:{
          id_producto : req.params.id,
          estado : 'A'
        }
      }).then(function(imagen_producto){
        models.imagen.find({
          where:{
            id_imagen: imagen_producto.id_imagen
          }
        }).then(function(imagen){
          producto.dataValues.imagen = imagen;
          res.json(producto);
        });
      });
    });
  });
  //modificar
  app.put('/api/producto/:id', function(req, res) {
    models.producto.find({
      where: {
        id_producto: req.params.id
      }
    }).then(function(producto) {
      if(producto){
        producto.updateAttributes({
          id_producto: req.body.id_producto,
          titulo: req.body.titulo
        }).then(function(producto) {
          res.send(producto);
        });
      }
    });
  });
  // delete a single producto
  app.delete('/api/producto/:id_menu&:id_producto', function(req, res) {
    models.detalle_menu.destroy({
      where: {
        id_producto: req.params.id_producto,
        id_menu: req.params.id_menu
      }
    }).then(function(result) {
      res.json(result);
    });
  });
};
