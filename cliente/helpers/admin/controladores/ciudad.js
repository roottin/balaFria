angular.module('balafria')
.controller('ctrlCiudad', ['Ciudades','Paises','$mdToast','$mdDialog','$scope', function(Ciudades,Paises,$mdToast,$mdDialog,$scope) {
    var yo = this;
     yo.centro = {
            lat: 31.353636941500987,
            lng: -41.66015625000001,
            zoom: 2
    };
    yo.markers = [];
    $scope.$on('leafletDirectiveMap.click', function(event, args) {
          var leafEvent = args.leafletEvent;
          yo.markers=[];
          console.log(leafEvent.latlng);
          yo.markers.push({
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            message: "Estas Aqui"
          });
          yo.ciudad.latlng = leafEvent.latlng;
          yo.ciudad.zoom = leafEvent.target._zoom;
        });
    yo.cambiarCentro = function(pais){
        yo.centro = {
            lat:pais.latlng.lat,
            lng:pais.latlng.lng,
            zoom:5
        }
        yo.ciudad.id_pais = pais.id_pais;
        yo.pais = pais;
    }
    yo.paises = Paises.query(function(){});
    yo.ciudad = new Ciudades();
    yo.submit = function(){ //function to call on form submit
        if (yo.upload_form.$valid && yo.pais && yo.ciudad.latlng) { //check if from is valid
            yo.ciudad.$save(function(resultado){
                $mdDialog.hide(resultado);
            });
        }
    };
    yo.cancel = function() {
        $mdDialog.hide();
    };
}]);
