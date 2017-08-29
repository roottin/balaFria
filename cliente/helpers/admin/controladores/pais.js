angular.module('balafria')
.controller('ctrlPais', ['Paises','$mdToast','$mdDialog','$scope', function(Paises,$mdToast,$mdDialog,$scope) {
    var yo = this;
    yo.centro = {
            lat: 31.353636941500987,
            lng: -41.66015625000001,
            zoom: 2
    };
    yo.markers = [];
    yo.pais = new Paises();
    $scope.$on('leafletDirectiveMap.click', function(event, args) {
          var leafEvent = args.leafletEvent;
          yo.markers=[];
          console.log(leafEvent.latlng);
          yo.markers.push({
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            message: "Estas Aqui"
          });
          yo.pais.latlng = leafEvent.latlng;
        });
    yo.submit = function(){ //function to call on form submit
        if (yo.upload_form.$valid && yo.pais.latlng) { //check if from is valid
            console.log(yo.pais);
            yo.pais.$save(function(resultado){
                $mdDialog.hide(resultado);
            });
        }
    };
    yo.cancel = function() {
        $mdDialog.hide();
    };
}]);
