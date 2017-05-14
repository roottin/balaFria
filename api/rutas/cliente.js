var models = require('../models/index');
var fs = require('fs');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');

var servidor = require('../../Servidor/servidor');
var service = require('../tokenAut');
var events  = require('events');//uso de hilos de ejecucion
var channel = new events.EventEmitter();
channel.on('inactivarImagenes',function(cambios){
  models.sequelize.query("update imagen_cliente set estado = 'I'"+
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
//envio de correos
const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'roottinca@gmail.com',
        pass: 'Nextbalafria'
    }
});
//-----------------------configuracion subida de archivos---------------
//ruta por defecto para cliente
var ruta  = './storage/cliente';

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
channel.on('enviarEmail', function(data){
  let host = data.host;
  let perfil = data.perfil;
  let rand = crypto.createHmac('sha1',perfil.email).update(perfil.nombre).digest('hex');
  let link = 'http://'+host+"/api/cliente/verificar?user="+perfil.email+"&id="+rand;
  // setup email data with unicode symbols
  let mailOptions = {
      from: 'roottinca@gmail.com', // sender address
      to: perfil.email, // list of receivers
      subject: 'Verificacion de Correo', // Subject line
      text: 'Hola '+perfil.nombre+' '+perfil.nombre+'te damos la bienvenida a la familia de Balafria. '+
            'presiona este link para verificar tu correo electronico', // plain text body
      html: '<h2>Hola '+perfil.nombre+' '+perfil.apellido+'</h2><br><p>te damos la bienvenida a la familia de Balafria.</p><br> '+
            'presiona este <a src="'+link+'">enlace</a> para verificar tu correo electronico<br>'+ // html body
            'o copie este link en su omnibar: '+link // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
});

module.exports = function(app){
  //guardar registro
  app.post('/api/cliente', function(req, res) {
    var pass = crypto.createHmac('sha1',req.body.correo).update(req.body.clave).digest('hex');
    models.cliente.create({
      "nombre": req.body.nombre,
      "apellido": req.body.apellido,
      "email": req.body.correo,
      "documento": req.body.documento,
      "clave": pass
    }).then(function(cliente){
      //creo la sesion del recien registrado
      var usuario = {
        "nombre":cliente.dataValues.nombre,
        "apellido":cliente.dataValues.apellido,
        "id":cliente.dataValues.id_cliente,
        "email":cliente.dataValues.email,
        "tipo":"cliente",
      };
      usuario.token = service.createToken(usuario);
      cliente.dataValues.token = usuario.token;
      servidor.addUsuario(usuario,null,usuario.token);
      servidor.mostrarListaUsuarios();
      channel.emit('enviarEmail',{
        perfil:usuario,
        host:req.get('host')
      });
      //mando la respuesta
      res.json(cliente);
    });
  });
  //buscar uno solo
  app.get('/api/cliente/:id', function(req, res) {
    models.sequelize.query('SELECT r.*,i.id_imagen,i.ruta as imagen_ruta FROM cliente r '+
                    ' left join imagen_cliente ir on r.id_cliente = ir.id_cliente AND ir.estado = '+"'A' AND id_tipo_imagen = 2"+
                    ' left join imagen i on ir.id_imagen = i.id_imagen  '+
                    " where id_cliente ='"+req.params.id+"'",
      { model:models.cliente}
    )
      .then(function(registro){
        registro = registro[0];
        var pass = crypto.createHmac('sha1',registro.dataValues.email).update(req.body.clave).digest('hex');
          var usuario = {
            "nombre":registro.dataValues.nombre,
            "documento":registro.dataValues.documento,
            "id":registro.dataValues['id_'+req.body.tipo],
            "email":registro.dataValues.email
          };
          if(registro.dataValues.id_imagen){
            usuario.avatar={
              "id":registro.dataValues.id_imagen,
              "ruta":registro.dataValues.imagen_ruta
            }
          }
        res.json(usuario);
    });
  });
  app.post('/api/cliente/avatar',upload,function(req,res){
    models.cliente.findOne({
      where:{
        "id_cliente":req.body.id_cliente
      }
    })
      .then(function(cliente){
        models.imagen.create({
          "nombre": req.file.filename,
          "ruta": req.file.path,
          "mimetype": req.file.mimetype
        }).then(function(imagen){
          models.imagen_cliente.create({
            "id_cliente":cliente.id_cliente,
            "id_imagen":imagen.id_imagen,
            "id_tipo_imagen":2 //id de avatar
          }).then(function(imagen_cliente){
            channel.emit('actualizarImagen',{
              "registro":imagen_cliente
            });
            cliente.dataValues.imagen = imagen;
            //creo la sesion del recien registrado
            var usuario = {
              "nombre":cliente.dataValues.nombre,
              "documento":cliente.dataValues.documento,
              "id":cliente.dataValues.id,
              "email":cliente.dataValues.email,
              "avatar":{
                "id":cliente.dataValues.imagen.id,
                "ruta":cliente.dataValues.imagen.ruta
              }
            };
            usuario = servidor.buscarUsuario(cliente.dataValues.id_cliente,'cliente');
            //mando la respuesta
            res.json(cliente);
          });
        });
      });
  });
  app.get('/api/cliente/verificar',function(req,res){
    models.cliente.findOne({
      'where':{
        'email':req.query.user
      }
    })
      .then(function(cliente){
        if (cliente == null) {
          res.redirect('http://'+req.get('host')+'/errorVerificacion');
        }
        let pass = crypto.createHmac('sha1',cliente.email).update(cliente.nombre).digest('hex');
        if(pass == req.query.id){
          models.cliente.update({
            email_v: true
          },{
            where:{ id_cliente:cliente.dataValues.id_cliente},
            returning:true,
            plain:true
          })
            .then(function(result){
              res.redirect('http://'+req.get('host')+'/#/cliente/usuario');
            });
        }else{
          res.redirect('http://'+req.get('host')+'/errorVerificacion');
        }
      });
  });
};
