function construirUI(){
	var lista = UI.agregarLista({
  	titulo: 'Tiendas',
  	clases: ['completa','tiendas'],
    campo_nombre: 'nombre',
		carga: {
			uso:true,
			peticion:{
				modulo:'global',
				entidad:'proveedor',
				operacion:'listar'
			},
			espera:{
				cuadro:{
					nombre: 'cargando',
					mensaje: 'cargando locales'
				}
			},
			respuesta:function(lista){
				lista.Slots.forEach(function(slot){
					armarTienda(slot);
				});
				esconderBarraBusqueda(lista);
			}
		}
	},document.querySelector('div[contenedor]'));
}
var esconderBarraBusqueda = function(lista){

};
var armarTienda = function(slot){
	var datos = slot.atributos;
	console.log(datos);
	slot.nodo.classList.add('tienda');
	var html = "<div parte-izq><img class='muestra' src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/220px-Eq_it-na_pizza-margherita_sep2005_sml.jpg'></img></div>"+
							"<div parte-der>"+
								"<div titulo>"+datos.nombre+"</div>"+
								"<div detalle>"+datos.descripcion+"</div>"+
							"</div>";
		slot.nodo.innerHTML = html;
};
