var ConsUsuario = function(){
	var self = this;
	self.construirUI = function(sesion){
		//TODO: cabiar icono por foto de usuario
		UI.elementos.cabecera.nodo.innerHTML+='<div class="material-icons white md-36 acc btnCart">shopping_cart</div>';
		UI.elementos.cabecera.nodo.querySelector('div.btnLog').onclick = function(){
			self.levantarOpciones(sesion);
		};
	}
	self.levantarOpciones = function(sesion){
		var modal =  UI.crearVentanaModal({
			clases:['angosto','opciones'],
			cabecera:{
				clases: ['titulo-opciones'],
				html: '<div class="material-icons md-36 lightgreen500">account_circle</div>'
			},
			cuerpo:{
				html: "<article opcion class='mat-lightgreen500 white'>Actualizar Datos<i class='material-icons md-24 icon '>account_circle</i></article>"+
					  "<article opcion class='mat-bluegrey500 white'>Datos de Pago<i class='material-icons md-24 icon '>payment</i></article>"+
					  "<article opcion class='mat-deeporange500 white'>Historial de Pedidos<i class='material-icons md-24 icon '>history</i></article>"+
					  "<article opcion class='mat-amber500 white'>Favoritos<i class='material-icons md-24 icon '>grade</i></article>"
			}
		});
	}
}