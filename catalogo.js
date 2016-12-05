function construirUI(){
	var lista = UI.agregarLista({
    	titulo: 'Tiendas',
    	clases: ['completa'],
        campo_nombre: 'nombre',
		carga: {
			uso:true,
			peticion:{
				modulo:'global',
				entidad:'proveedores',
				operacion:'buscar'
			},
			espera:{
				cuadro:{
					nombre: 'cargando',
					mensaje: 'cargando locales'
				}
			}
		}
	},document.querySelector('div[contenedor]'));
}
