function construirUI(){
	var lista = UI.agregarLista({
  	titulo: 'Tiendas',
  	clases: ['completa'],
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
};
