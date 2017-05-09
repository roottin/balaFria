var models = require('../models/index');
var fs = require('fs');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');

var servidor = require('../../Servidor/servidor');

//-----------------------configuracion subida de archivos---------------
//ruta por defecto para proveedor
var ruta  = './storage/proveedor';

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
//------------------------configuracion subida de archivos ------------------
var models = require('../models/index');
module.exports = function(app){
  //obtener proveedores
  app.get('/api/proveedores', function(req, res) {
    models.proveedor.findAll({}).then(function(proveedores) {
      res.json(proveedores);
    });
  });
  //guardar registro
  app.post('/api/proveedor',upload, function(req, res) {
    var pass = crypto.createHmac('sha1',req.body.documento).update(req.body.clave).digest('hex');
    models.proveedor.create({
      "nombre": req.body.nombre,
      "email": req.body.email,
      "documento": req.body.documento,
      "clave": pass
    }).then(function(proveedor) {
      models.imagen.create({
        "nombre": req.file.filename,
        "ruta": req.file.path,
        "mimetype": req.file.mimetype
      }).then(function(imagen){
        models.imagen_proveedor.create({
          "id_proveedor":proveedor.id_proveedor,
          "id_imagen":imagen.id_imagen,
          "id_tipo_imagen":2 //id de avatar
        }).then(function(imagen_proveedor){
          proveedor.dataValues.imagen = imagen;
          //creo la sesion del recien registrado
          servidor.addUsuario(perfil);
          servidor.mostrarListaUsuarios();
          //mando la respuesta
          res.json(proveedor);
        });
      });
    });
  });
  //buscar uno solo
  app.get('/api/proveedor/:id', function(req, res) {
    models.proveedor.find({
      where: {
        id_proveedor: req.params.id
      }
    }).then(function(proveedor) {
      res.json(proveedor);
    });
  });
  //modificar
  app.put('/api/proveedor/:id', function(req, res) {
    models.proveedor.find({
      where: {
        id_proveedor: req.params.id
      }
    }).then(function(proveedor) {
      if(proveedor){
        proveedor.updateAttributes({
          id_proveedor: req.body.id_proveedor,
          nombre: req.body.nombre,
          documento: req.body.documento
        }).then(function(proveedor) {
          res.send(proveedor);
        });
      }
    });
  });
  // delete a single proveedor
  app.delete('/api/proveedor/:id', function(req, res) {
    models.proveedor.destroy({
      where: {
        id_proveedor: req.params.id
      }
    }).then(function(proveedor) {
      res.json(proveedor);
    });
  });
};
