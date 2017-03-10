var Login = function(){
  var self = this;
  self.plano = {
      "logIn":{
        "altura": 150,
        "campos":[
          {
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Nombre de Usuario o Email',nombre:'cliente',tipo:'simple',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Clave',nombre:'clave',tipo:'password',eslabon:'area',usaToolTip:true}
          }
        ]
      },
      "registrate":{
        "altura": 400,
        "campos":[
          {
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Apellido',nombre:'apellido',tipo:'simple',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Correo Electronico',nombre:'clave',tipo:'simple',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Clave',nombre:'clave',tipo:'password',eslabon:'area',usaToolTip:true}
          },{
            "tipo" : 'campoDeTexto',
            "parametros" : {requerido:true,titulo:'Confirme Clave',nombre:'clave',tipo:'password',eslabon:'area',usaToolTip:true}
          }
        ]
      }      
    };

  self.construirLogin = function(){
    var modal = UI.crearVentanaModal({
      clases:['logIn'],
      cabecera:{
        html: '<div class="material-icons md-36 lightgreen500">account_circle</div>'
      },
      cuerpo:{
        formulario:self.plano.logIn,
        tipo: 'nuevo'
      },
      pie:{
          clases:['botonera'],
          html:'<button type="button" nombre="enviar" class="mat-text-but">Accesar</button>'+
                '<button type="button" nombre="registrar" class="mat-text-but">Registrate</button>'
      }
    });
    modal.partes.pie.buscarBoton('enviar').nodo.onclick = function(){
      var formulario = modal.partes.cuerpo.formulario;
      if(!formulario.validar()){
        UI.agregarToasts({
          texto: 'Debe llenar los campos antes de continuar',
          tipo: 'web-arriba-derecha-alto'
        });
      }else{
        var peticion = UI.juntarObjetos({
           entidad: "cliente",
           operacion: "accesar"
        },formulario.captarValores());
        var cuadro = {
          contenedor: modal.partes.cuerpo.nodo,
          cuadro:{
            nombre: 'Accesar',
            mensaje: 'Verificando Datos de Sesion'
          }
        };
        torque.manejarOperacion(peticion,cuadro)
          .then(function(resultado){
            console.log(resultado);
          });
      }
    };

    modal.partes.pie.buscarBoton('registrar').nodo.onclick = function(){
      self.construirRegistro(modal);
    };
  };
  self.construirRegistro = function(modal){
    modal.partes.cuerpo.nodo.innerHTML = '';
      modal.partes.cuerpo.agregarFormulario({
        "formulario" : self.plano.registrate,
        "tipo": "nuevo"
      });
      modal.partes.pie.nodo.innerHTML ='<button type="button" nombre="enviar" class="mat-text-but">Enviar Registro</button>'+
                '<button type="button" nombre="volver" class="mat-text-but">Volver</button>';
    //TODO: agregar funcionamiento botones
  }
};
