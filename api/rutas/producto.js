var models = require('../models/index');
var fs = require('fs');
var dateParser = require('../../Servidor/dateParser');
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
  app.get('/api/productos/:id_proveedor&:id_detalle_menu', function(req, res) {
    models.sequelize.query('SELECT r.*,i.ruta,pp.valor as precio FROM producto r '+
                    ' join imagen_producto ir on r.id_producto = ir.id_producto AND ir.estado = '+"'A'"+
                    ' join imagen i on ir.id_imagen = i.id_imagen  '+
                    " join producto_precio pp on pp.id_producto_precio = (select id_producto_precio from producto_precio where id_producto = r.id_producto and fecha_final is null )"+
                    ' where id_proveedor =  '+req.params.id_proveedor+
                    ' and r.id_producto not in(select id_producto from detalle_categoria where id_detalle_menu = '+req.params.id_detalle_menu+')',
      { model: models.producto}
    )
      .then(function(productos) {
        res.json(productos);
      });
  });
  //guardar registro
  app.post('/api/productos',upload, function(req, res) {
    models.producto.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
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
          models.detalle_categoria.create({
            id_producto:producto.id_producto,
            id_detalle_menu:req.body.id_detalle_menu,
            secuencia:req.body.secuencia
          }).then(function(){
            models.producto_precio.create({
              id_producto:producto.id_producto,
              valor:req.body.precio,
              fecha_inicio:dateParser.getParseDate()
            }).then(producto_precio => {
              producto.dataValues.precio = producto_precio.precio;
              producto.dataValues.fecha_precio = producto_precio.fecha_inicio;
              res.json(producto);
            })
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
          nombre: req.body.nombre,
          descripcion: req.body.descripcion
        }).then(function(producto) {
          models.sequelize.query("update detalle_categoria set secuencia="+req.body.secuencia+
                                  " where id = "+req.body.id_detalle_categoria)
            .then(function(){
              models.producto_precio.find({
                where:{
                  id_producto:producto.id_producto,
                  fecha_final: null
                }
              })
              .then(function(producto_precio){
                console.log(producto.precio);
                if(producto_precio.valor != producto.dataValues.precio){
                  producto_precio
                    .updateAttributes({fecha_final:dateParser.getParseDate()})
                    .then(function(){
                      models.producto_precio.create({
                        id_producto:producto.id_producto,
                        valor:req.body.precio,
                        fecha_inicio:dateParser.getParseDate()
                      })
                        .then(function(){
                          res.json(producto);
                        })
                    })
                }else{
                  res.json(producto);
                }
              })
            });
        });
      }
    });
  });
  // delete a single producto
  app.delete('/api/producto/:id_detalle_menu&:id_producto', function(req, res) {
    models.detalle_categoria.destroy({
      where: {
        id_producto: req.params.id_producto,
        id_detalle_menu: req.params.id_detalle_menu
      }
    }).then(function(result) {
      res.json(result);
    });
  });
};
