var models = require('../models/index');
var fs = require('fs');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');
//configuracion subida de archivos

//ruta por defecto para tipo_imagen
var ruta  = './storage/tipo_imagen';

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

var models = require('../models/index');
module.exports = function(app){
  //obtener tipo_imagenes
  app.get('/api/tipoImagenes', function(req, res) {
    models.tipo_imagen.findAll({}).then(function(tipo_imagenes) {
      res.json(tipo_imagenes);
    });
  });
  //guardar registro
  app.post('/api/tipoImagenes',upload, function(req, res) {
    console.log(req.body);
    models.tipo_imagen.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion
    })
    .then(function(tipo_imagen){
        res.json(tipo_imagen);
    });
  });
  //buscar uno solo
  app.get('/api/tipoImagen/:id', function(req, res) {
    models.tipo_imagen.find({
      where: {
        id_tipo_imagen: req.params.id
      }
    }).then(function(tipo_imagen) {
      res.json(tipo_imagen);
    });
  });
  //modificar
  app.put('/api/tipoImagen/:id', function(req, res) {
    models.tipo_imagen.find({
      where: {
        id_tipo_imagen: req.params.id
      }
    }).then(function(tipo_imagen) {
      if(tipo_imagen){
        tipo_imagen.updateAttributes({
          id_tipo_imagen: req.body.id_tipo_imagen,
          nombre: req.body.nombre,
          documento: req.body.descripcion
        }).then(function(tipo_imagen) {
          res.send(tipo_imagen);
        });
      }
    });
  });
  // delete a single tipo_imagen
  app.delete('/api/tipoImagen/:id', function(req, res) {
    models.tipo_imagen.destroy({
      where: {
        id_tipo_imagen: req.params.id
      }
    }).then(function(tipo_imagen) {
      res.json(tipo_imagen);
    });
  });
};
