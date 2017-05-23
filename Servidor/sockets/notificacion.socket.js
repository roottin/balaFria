var db = require('../../api/models/index');
var servidor = require('../servidor');

function init(usuario,conexion){
  conexion.socket.on('modNot',function(data){
    console.log('notificacion recibida: ',data);
    //tipos
      //trivial
      //accion-corta
      //accion-larga
      //urgente
    db.notificacion.create({
      "titulo":data.titulo,
      "cuerpo":data.cuerpo,
      "id_tipo_notificacion":data.id_tipo_notificacion
    })
      .then(function(notificacion){
        var relacion_notificacion = {};
        relacion_notificacion["id_"+data.entidad] = data["id_"+data.entidad];
        relacion_notificacion["id_notificacion"] = data.id_notificacion;
        db["notificacion_"+data.entidad].create(relacion_notificacion)
      })
        .then(function(notificacion){
          var user = servidor.buscarUsuario(data["id_"+data.entidad],data.entidad);
          if(user){
            usuario.emit.('modNot',data);
          }
        })
        .catch(function(err){
          console.error(err);
        });
  });
}
