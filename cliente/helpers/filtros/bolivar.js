angular.module('balafria')
.filter("bolivar",function(){
	return function(texto){
		if (texto !== null) {
			texto = (isNaN(texto))?texto:String(texto);
			var partes = texto.split(',');
			var i = 0;
			partes[0] = partes[0]
				.split("")
				.reverse()
				.map(function(cifra){
					i++;
					if(i%3==0){
						cifra="."+cifra;
					}
					return cifra
				})
				.reverse()
				.join("");
			if(!partes[1]){
				partes[1]="00";
			}
			return partes[0]+","+partes[1]+" Bs";
		}
	}
})
