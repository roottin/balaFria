var ConsUsuario = function(){
	var self = this;
	self.construirUI = function(sesion){
		//TODO: cabiar icono por foto de usuario
		UI.elemento.cabecera.nodo.innerHTML+='<div class="material-icons white md-36 acc btnLog">shopping</div>';
		UI.elemento.cabecera.nodo.querySelector('div.btnLog').onclick = function(){
			self.levantarOpciones(sesion);
		};
	}
	self.levantarOpciones = function(sesion){
		var modal =  UI.crearVentanaModal({
			clases:['angosta'],
			cabecera:{
				html: '<div class="material-icons md-36 lightgreen500">account_circle</div>'
			},
			cuerpo:{
				html: "<article opcion>Actualizar Datos<i class='material-icons md-24 icon lightgreen500 white'>account_circle</i></article>"+
					  "<article opcion>Datos de Pago<i class='material-icons md-24 icon grayblue500 white'>payment</i></article>"+
					  "<article opcion>Historial de Pedidos<i class='material-icons md-24 icon white deeporange500'>history</i></article>"+
					  "<article opcion>Ver Favoritos<i class='material-icons md-24 icon amber500 white'>grade</i></article>"+
			}
		});
	}
}