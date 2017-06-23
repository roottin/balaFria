var models = require('../models/index');
//configuracion subida de archivos

//ruta por defecto para sucursal
var ruta  = './storage/sucursal';

//multer
var Multer = require('multer');

var upload = Multer({storage: Multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, ruta);
    },
    filename: function (req, file, callback) {
      var datetimestamp = Date.now();
      console.log(req.body);
      var nombreArchivo = 'S_ID'+req.body.id_sucursal + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
      callback(null, nombreArchivo);}
    })
}).single('file');

module.exports = function(app){
  //obtener sucursales
  app.get('/api/sucursales/:id', function(req, res) {
    models.sucursal.findAll({
       where: {
        id_proveedor: req.params.id
      }
    })
      .then(function(sucursales) {
        res.json(sucursales);
      });
  });
  //guardar registro
  app.post('/api/sucursal', function(req, res) {
    models.sucursal.create({
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      id_proveedor: req.body.id_proveedor
    })
    .then(function(sucursal){
        Promise.all(req.body.sucursals.map(function(sucursal){
          return models.sucursal_sucursal.create({
            id_sucursal: sucursal.id_sucursal,
            id_sucursal: sucursal.id_sucursal
          });
        })).then(function(resultado){
          res.json(sucursal);
        });
    });
  });
  //buscar uno solo
  app.get('/api/sucursal/:id', function(req, res) {
    models.sequelize.query("SELECT s.*,i.ruta as imagen_ruta FROM sucursal s" +
            " left join imagen_sucursal isu on s.id_sucursal = isu.id_sucursal"+
            " AND isu.estado = 'A' AND isu.id_tipo_imagen = 1"+
            " left join imagen i on isu.id_imagen = i.id_imagen" +
            " where s.id_sucursal = "+req.params.id ,
      { model: models.sucursal}
    )
      .then(function(sucursal) {
        sucursal = sucursal[0];
        sucursal.dataValues.banner = {
          ruta: sucursal.dataValues.imagen_ruta
        }
        res.json(sucursal);
      });
  });

  app.post('/api/sucursal/banner/:id',upload, function(req, res) {
    req.body = req.body.datos;
    models.imagen_sucursal.find({
      where:{id_sucursal: req.params.id,estado:"A",id_tipo_imagen:1}
    })
      .then(function(imagen_sucursal){
        if(imagen_sucursal){
          imagen_sucursal.updateAttributes({
            estado:"I"
          });
        }
      });

    models.sucursal.find({
      where: {id_sucursal: req.params.id}
    }).then(function(sucursal) {
      if(sucursal){
          models.imagen.create({
            nombre: req.file.filename,
            ruta: req.file.path,
            mimetype: req.file.mimetype
          }).then(function(imagen){
            models.imagen_sucursal.create({
              id_sucursal:sucursal.id_sucursal,
              id_imagen:imagen.id_imagen,
              id_tipo_imagen:1//Banner
            }).then(function(imagen_sucursal){
              sucursal.dataValues.banner = imagen;
            });
          })
          .then(function(result){
            res.json(sucursal);
          })
      }
    });
  });
  //modificar
  app.put('/api/sucursal/:id', function(req, res) {
    models.sucursal.find({
      where: {
        id_sucursal: req.params.id
      }
    }).then(function(sucursal) {
      if(sucursal){

        sucursal.updateAttributes({
          id_sucursal: req.body.id_sucursal,
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
        }).then(function(sucursal) {
          Promise.all([

          ])
          .then(function(result){
            console.log(result);
            res.json(sucursal);
          })
        });
      }
    });
  });
  // delete a single sucursal
  app.delete('/api/sucursal/:id', function(req, res) {
    models.sucursal.destroy({
      where: {
        id_sucursal: req.params.id
      }
    }).then(function(sucursal) {
      res.json(sucursal);
    });
  });
};
