var db = require('../../api/models/index');
var servidor = require('../servidor');

function inicializarNotificaciones(usuario,conexion){
  conexion.socket.on('modNot',function(data){
    console.log('notificacion recibida: ',data);
    //tipos
      //trivial
      //accion-corta
      //accion-larga
      //urgente
    if(data.entidad == 'proveedor'){
      db.notificacion.create({
        "titulo":data.titulo,
        "cuerpo":data.cuerpo,
        "id_tipo_notificacion":data.id_tipo_notificacion
      })
        .then(function(notificacion){
          db.notificacion_proveedor.create({
            "id_proveedor":data.id_proveedor,
            "id_notificacion":data.id_notificacion
          })
        })
          .then(function(notificacion_proveedor){
            var usuario = servidor.buscarUsuario(data.id_proveedor,'proveedor');
            if(usuario){
              usuario.emit.('modNot',data);
            }
          });
    }
  });
}
