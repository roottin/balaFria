var models = require('../models/index');
var fs = require('fs');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');

var servidor = require('../../Servidor/servidor');
var service = require('../tokenAut');

//uso de hilos de ejecucion
var events  = require('events');
var channel = new events.EventEmitter();
channel.on('inactivarImagenes',function(cambios){
  models.sequelize.query("update imagen_proveedor set estado = 'I'"+
                          " where id <> '"+cambios.registro.dataValues.id+"'")
    .then(function(resultado){
      console.log('inactivar imaneges');
      console.log(resultado);
      console.log('##########################################');
    }).catch(function(err){
      console.log('inactivar imaneges');
      console.log(err);
      console.log('##########################################');
    });
});
//----------------------------envio de correos------------------------------
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'roottinca@gmail.com',
        pass: 'Nextbalafria'
    }
});

channel.on('enviarEmail', function(data){
  let host = data.host;
  let perfil = data.perfil;
  let rand = crypto.createHmac('sha1',perfil.email).update(perfil.nombre).digest('hex');
  let link = 'http://'+host+"/api/proveedor/verificar?user="+perfil.email+"&id="+rand;
  // setup email data with unicode symbols
  let mailOptions = {
      from: 'roottinca@gmail.com', // sender address
      to: perfil.email, // list of receivers
      subject: 'Verificacion de Correo', // Subject line
      text: 'Hola '+perfil.nombre+' '+perfil.nombre+'te damos la bienvenida a la familia de Balafria. '+
            'presiona este link para verificar tu correo electronico', // plain text body
      html: '<h2>Hola '+perfil.nombre+' '+perfil.nombre+'</h2><br><p>te damos la bienvenida a la familia de Balafria.</p><br> '+
            'presiona este link para verificar tu correo electronico' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
});
//----------------------------envio de correos------------------------------
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
    var pass = crypto.createHmac('sha1',req.body.email).update(req.body.clave).digest('hex');
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
          var usuario = {
            "nombre":proveedor.dataValues.nombre,
            "documento":proveedor.dataValues.documento,
            "id":proveedor.dataValues.id_proveedor,
            "email":proveedor.dataValues.email,
            "tipo":"proveedor",
            "avatar":{
              "id":proveedor.dataValues.imagen.id,
              "ruta":proveedor.dataValues.imagen.ruta
            }
          };
          usuario.token = service.createToken(usuario);
          proveedor.dataValues.token = usuario.token;
          servidor.addUsuario(usuario,null,usuario.token);
          servidor.mostrarListaUsuarios();
          channel.emit('enviarEmail',{
            perfil:usuario,
            host:req.get('host')
          });
          //mando la respuesta
          res.json(proveedor);
        });
      });
    });
  });
  //buscar uno solo
  app.get('/api/proveedores/:id', function(req, res) {
    models.sequelize.query( "select p.*,i.ruta from proveedor p "+
                            "join imagen_proveedor ip on p.id_proveedor = ip.id_proveedor "+
                            "and ip.estado ='A' and ip.id_tipo_imagen = 2 "+
                            "join imagen i on ip.id_imagen = i.id_imagen "+
                            "where p.id_proveedor = "+req.params.id,
      {model:models.proveedor}
    ).then(function(proveedor) {
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
  app.get('/api/proveedor/verificar',function(req,res){
    models.proveedor.findOne({
      'where':{
        'email':req.query.user
      }
    })
      .then(function(proveedor){
        if (proveedor == null) {
          res.redirect('http://'+req.get('host')+'/errorVerificacion');
        }
        let pass = crypto.createHmac('sha1',proveedor.email).update(proveedor.nombre).digest('hex');
        if(pass == req.query.id){
          models.proveedor.update({
            email_v: true
          },{
            where:{ id_proveedor:proveedor.dataValues.id_proveedor},
            returning:true,
            plain:true
          })
            .then(function(result){
              res.redirect('http://'+req.get('host')+'/#/proveedor/dashboard');
            });
        }else{
          res.redirect('http://'+req.get('host')+'/errorVerificacion');
        }
      });
  });
};
