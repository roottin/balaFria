var Login = function(){
  var self = this;
  self.plano = {
      altura: 150,
      campos:[
        {
          tipo : 'campoDeTexto',
          parametros : {requerido:true,titulo:'Nombre de Usuario o Email',nombre:'cliente',tipo:'simple',eslabon:'area',usaToolTip:true}
        },{
          tipo : 'campoDeTexto',
          parametros : {requerido:true,titulo:'Clave',nombre:'clave',tipo:'password',eslabon:'area',usaToolTip:true}
        }
      ]
    };

  self.construirLogin = function(){
    var modal = UI.crearVentanaModal({
      clases:['logIn'],
      cabecera:{
        html: '<div class="material-icons md-36 lightgreen500">account_circle</div>'
      },
      cuerpo:{
        formulario:self.plano,
        tipo: 'nuevo'
      },
      pie:{
          clases:['botonera'],
          html:'<button type="button" nombre="enviar" class="icon material-icons green500">send</button>'
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
  };
};
