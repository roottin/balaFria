var models = require('../models/index');
var fs = require('fs');
//configuracion subida de archivos

//ruta por defecto para rubro
var ruta  = './storage/rubro';

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
  //obtener rubros
  app.get('/api/rubros', function(req, res) {
    models.sequelize.query('SELECT r.*,i.ruta as imagen_ruta FROM rubro r '+
                    ' join imagen_rubro ir on r.id_rubro = ir.id_rubro AND ir.estado = '+"'A'"+
                    ' join imagen i on ir.id_imagen = i.id_imagen  ',
      { model: models.rubro}
    )
      .then(function(rubros) {
        res.json(rubros);
      });
  });
  //guardar registro
  app.post('/api/rubros',upload, function(req, res) {
    models.rubro.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      color: req.body.color,
    }).then(function(rubro) {
      models.imagen.create({
        nombre: req.file.filename,
        ruta: req.file.path,
        mimetype: req.file.mimetype
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
          rubro.dataValues.imagen = imagen;
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
