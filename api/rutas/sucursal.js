var models = require('../models/index');
//uso de hilos de ejecucion
var events  = require('events');
var channel = new events.EventEmitter();
//----------------------configuracion subida de archivos---------------------
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
        var nombreArchivo = 'S_ID'+req.body.id_sucursal + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        callback(null, nombreArchivo);}
      })
  }).single('file');
//----------------------configuracion subida de archivos---------------------

module.exports = function(app){

  //NOTE: obtener sucursales
  app.get('/api/sucursal/all', function(req, res) {
    models.sequelize
      .query("select s.*, i.ruta from sucursal s "+
                              "join imagen_proveedor ip on s.id_proveedor = ip.id_proveedor "+
                              "join imagen i on ip.id_imagen = i.id_imagen",
        { model: models.sucursal})
      .then(function(sucursales){
        res.json(sucursales);
      });
  });
  //NOTE: obtener sucursales por rubro
  app.get('/api/sucursal/rubro/:id', function(req, res) {
    models.sequelize
      .query("select s.*, i.ruta,c.latitud, c.longitud from sucursal s "+
        "join imagen_proveedor ip on s.id_proveedor = ip.id_proveedor "+
        "join imagen i on ip.id_imagen = i.id_imagen "+
        "join sucursal_rubro sr on s.id_sucursal = sr.id_sucursal "+
        "left join coordenada c on s.id_coordenada = c.id_coordenada " +
        "where sr.id_rubro = "+req.params.id,
        { model: models.sucursal})
      .then(function(sucursales){
        res.json(sucursales);
      });
  });
  //NOTE: obtener sucursales
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
  //NOTE: guardar registro
  app.post('/api/sucursal', function(req, res) {
    models.sucursal.create({
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      id_proveedor: req.body.id_proveedor
    })
    .then(function(sucursal){
        Promise.all(req.body.rubros.map(function(rubro){
          return models.sucursal_rubro.create({
            id_sucursal: sucursal.id_sucursal,
            id_rubro: rubro.id_rubro
          });
        })).then(function(resultado){
          res.json(sucursal);
        });
    });
  });
  //NOTE: buscar uno solo
  app.get('/api/sucursal/:id', function(req, res) {
    var zonasAtencion = [];
    //busco la sucursal con su banner
    models.sequelize.query("SELECT s.*,i.ruta as imagen_ruta, c.latitud, c.longitud, ms.id_menu FROM sucursal s" +
            " left join imagen_sucursal isu on s.id_sucursal = isu.id_sucursal"+
            " AND isu.estado = 'A' AND isu.id_tipo_imagen = 1"+
            " left join imagen i on isu.id_imagen = i.id_imagen" +
            " left join coordenada c on s.id_coordenada = c.id_coordenada" +
            " left join menu_sucursal ms on s.id_sucursal = ms.id_sucursal" +
            " where s.id_sucursal = "+req.params.id ,
      { model: models.sucursal}
    )
      .then(function(sucursal) {
        sucursal = sucursal[0];
        //agrego el banner a la sucursal
        sucursal.dataValues.banner = {
          "ruta": sucursal.dataValues.imagen_ruta
        }
        sucursal.dataValues.ubicacion = {
          "lng": sucursal.dataValues.longitud,
          "lat": sucursal.dataValues.latitud
        }
        //busco las zonas de envio de la sucursal
        models.zona_envio.findAll({where:{"id_sucursal":req.params.id}})
          .then(zonas => {
            sucursal.dataValues.zonasAtencion = [];
            Promise.all(zonas.map(zona => {
              //zona por zona busco sus coordenadas
              return models.sequelize.query("SELECT c.latitud,c.longitud,dze.secuencia,c.id_coordenada,dze.id as id_detalle from coordenada c "+
                                              "join detalle_zona_envio dze on dze.id_coordenada = c.id_coordenada "+
                                              "where dze.id_zona_envio = "+zona.dataValues.id_zona_envio+
                                              " order by secuencia")
              .then(coordenadas => {
                //armo el objeto coordenadas
                zona.dataValues.coordenadas = coordenadas[0].map(coordenada => {
                  return {
                    "latlng":{"lat":coordenada.latitud,"lng":coordenada.longitud},
                    "secuencia": coordenada.secuencia,
                    "id_coordenada": coordenada.id_coordenada
                  }
                })
                //retorna la zona
                zonasAtencion.push(zona.dataValues);
              })
            }))
              .then(result => {
                sucursal.dataValues.zonasAtencion = zonasAtencion;
                //busco los contactos
                models.sucursal_contacto.findAll({where:{"id_sucursal":sucursal.dataValues.id_sucursal}})
                  .then(contactosBD => {
                    var resultado = contactosBD.map(contacto => { return contacto.dataValues});
                    return Promise.resolve(resultado);
                  })
                  .then(contactos => {
                    sucursal.dataValues.contactos = contactos;
                    //envio sucursal
                    res.json(sucursal);
                  })
              });
          });
      });
  });
  //NOTE: modificar banner
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
              console.log(sucursal);
              sucursal.dataValues.banner = imagen;
            });
          })
          .then(function(result){
            res.json(sucursal);
          })
      }
    });
  });
  //NOTE: modificar uno
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
            modificarUbicacion(sucursal,req.body.ubicacion.latlng),
            modificarZonas(sucursal,req.body.zonasAtencion),
            modificarContactos(sucursal,req.body.contactos)
          ])
            .then(result =>{
              sucursal.dataValues.ubicacion = {
                "lat":result[0].dataValues.latitud,
                "lng":result[0].dataValues.longitud,
              };
              sucursal.dataValues.zonasAtencion = result[1];
              sucursal.dataValues.contactos = result[2].map(contacto => {
                return contacto.dataValues;
              });
              res.json(sucursal);
            })
        });
      }
    });
  });
  //NOTE: delete a single sucursal
  app.delete('/api/sucursal/:id', function(req, res) {
    models.sucursal.destroy({
      where: {
        id_sucursal: req.params.id
      }
    }).then(function(sucursal) {
      res.json(sucursal);
    });
  });
  app.put('/api/sucursales/cambiarMenu',function(req, res){
    models.menu_sucursal
      .find({where:{id_sucursal:req.body.id_sucursal}})
      .then(menu_sucursal => {
        if(menu_sucursal){
          menu_sucursal.updateAttributes({
            id_menu: req.body.id_menu
          })
          .then(result => {
            res.json(result);
          })
        }else{
          models.menu_sucursal
            .create({
              id_menu: req.body.id_menu,
              id_sucursal: req.body.id_sucursal
            })
            .then(result =>{
              res.json(result);
            })
        }
      })
  });
};
//////////////////////////////////////////////////////////////////////////////
//NOTE: modificar contactos
function modificarContactos(sucursal,contactos){
  return  models.sucursal_contacto.findAll({where:{"id_sucursal":sucursal.id_sucursal}})
    .then(contactosBD => {
      return Promise.all(contactosBD.map(contactosBD =>{
        return contactosBD.destroy();
      }))
        .then(result => {
          return Promise.all(contactos.map(contacto => {
            return models.sucursal_contacto.create({
              "tipo":contacto.clase,
              "valor":contacto.contenido,
              "id_sucursal":sucursal.id_sucursal
            });
          }))
        })
    });
};
//NOTE: modificar Ubicacion
function modificarUbicacion(sucursal,latlng){
  var cambio = false;
  if(!sucursal.id_coordenada){
    if(latlng){
      cambio = true;
    }
  }else{
    models.coordenada.find({
      id_coordenada:sucursal.id_coordenada
    })
      .then(function(coordenada){
        if((coordenada.latitud !== latlng.latitud)&&(coordenada.longitud !== latlng.longitud)){
          cambio = true;
        }
      });
  }
  if(cambio){
    return models.coordenada.create({
      latitud:latlng.lat,
      longitud:latlng.lng
    })
      .then(function(coordenada){
        return sucursal.updateAttributes({
          id_coordenada:coordenada.dataValues.id_coordenada
        }).then(result => {
          return coordenada;
        })
      });
  }else{
    return models.coordenada.find({where:{"id_coordenada":sucursal.id_coordenada}});
  }
};
//NOTE: modificar Zonas
function modificarZonas(sucursal,zonas){
  return models.zona_envio.findAll({
    where:{"id_sucursal":sucursal.id_sucursal}
  })
    .then(function(zonasEnvio){
      var zonasNuevas = [];
      var zonasAModificar = [];
      var zonasABorrar = [];
      var asignada = false;
      for (var i = 0; i < zonas.length; i++) {
        asignada = false;
        for (var x = 0; x < zonasEnvio.length; x++) {
          if(zonasEnvio[x].id_zona_envio === zonas[i].id_zona_envio){
            zonasAModificar.push(zonas[i]);
            zonasEnvio.splice(x,1);
            asignada = true;
            break;
          }
        }
        if(!asignada){
          zonasNuevas.push(zonas[i]);
        }
        //aquellas zonas que no se van a modificar dentro de zona envio son para borrar
        zonasABorrar = zonasEnvio;
      }
      return Promise.all(
        [
          ////inserto todas las zonas
          Promise.all(zonasNuevas.map(zona => models.zona_envio.create({
            "nombre":zona.nombre,
            "descripcion":zona.descripcion,
            "id_sucursal":sucursal.id_sucursal
          })
            //inserto todas las coordenadas
            .then(zonaDB => {
              Promise.all(zona.coordenadas.map(cdn => models.coordenada.create({
                "latitud":cdn.latlng.lat,
                "longitud":cdn.latlng.lng,
              })
                //armo el detalle de la zona
                .then(cdnDb => {
                  models.detalle_zona_envio.create({
                    "id_zona_envio":zonaDB.id_zona_envio,
                    "id_coordenada":cdnDb.id_coordenada,
                    "secuencia":cdn.secuencia
                  });
                })
              ))
            })
          )),
          //borro todas las zonas a borrar
          zonasABorrar.forEach(zona => {
            zona.destroy();
          }),
          //me voy contra las zonas a modificar
          Promise.all(zonasAModificar.map(zona => {
            //busco todas las zona_envio de esa zona para borrarlas
            return models.detalle_zona_envio.findAll({where:{"id_zona_envio":zona.id_zona_envio}})
              .then(resultado => {
                //borro todas las coordenadass del detalle
                return Promise.all(resultado.map(detalle_zona_envio => {
                  detalle_zona_envio.destroy()
                  return models.coordenada.find({where:{"id_coordenada":detalle_zona_envio.id_coordenada}})
                    .then(coordenada => {
                      return coordenada.destroy();
                    })
                }))
                //luego de esto paso a registrar las nuevas coordenadas
                .then(r => {
                  //las registro
                  return Promise.all(zona.coordenadas.map(cdn => {
                      return models.coordenada.create({
                      "latitud":cdn.latlng.lat,
                      "longitud":cdn.latlng.lng
                      })
                      //armo el detalle de la zona
                      .then(cdnDb => {
                        models.detalle_zona_envio.create({
                          "id_zona_envio":zona.id_zona_envio,
                          "id_coordenada":cdnDb.id_coordenada,
                          "secuencia":cdn.secuencia
                        });
                      })
                    })
                  )
                })
              })
          }))
        ]
      );
    })
      .then(result => {
        return Promise.resolve(zonas);
      });
};
