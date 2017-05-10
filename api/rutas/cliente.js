var models = require('../models/index');
var fs = require('fs');
//llamamos a crypto para encriptar la contraseña
var crypto = require('crypto');

var servidor = require('../../Servidor/servidor');
var service = require('../tokenAut');
var events  = require('events');//uso de hilos de ejecucion
var channel = new events.EventEmitter();
const nodemailer = require('nodemailer');//envio de correos
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
      };
      usuario.token = service.createToken(usuario);
      cliente.dataValues.token = usuario.token;
      servidor.addUsuario(usuario);
      servidor.mostrarListaUsuarios();
      channel.emit('enviarEmail',{
        perfil:usuario,
        host:req.get('host')
      });
      //mando la respuesta
      res.json(cliente);
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
          res.redirect('http://www.socaportuguesa.com');
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
