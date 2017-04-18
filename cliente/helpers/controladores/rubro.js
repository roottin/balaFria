angular.module('balafria')
.controller('ctrlRubro', ['$scope','$http', function ($scope,$http) {
  $scope.$watch('file.length',function(newVal,oldVal){
      console.log($scope.file);
  });
  var prepararImagen = function(){
    return new Promise(function(completada,rechazada){
      var f = $scope.file[0].lfFile;
      var r = new FileReader();
      r.onloadend = function(e){
        var data = {
          'byteArray':e.target.result,
          'content_type':f.type,
          'nombre':f.name
        };
        completada(data);
      };
      r.readAsBinaryString(f);
    });
  };
  $scope.enviar = function(){
      prepararImagen()
      .then(function(dataImagen){
        var peticion = {
          "imagen": dataImagen,
          "nombre": $scope.nombre
        };
        return peticion;
      })
      .then(function(formData){
        return $http({
          'method':'POST',
          'data':JSON.stringify(formData),
          'transformRequest': [],
          'headers': {'Content-Type': 'application/json;charset=UTF-8'},
          'url':'./api/rubros'
        });
      })
      .then(function(result){
          var blob = new Blob([result.data.imagen.archivo.data],{type:result.data.imagen.content_type});
          var vinculo = document.createElement('a');
          vinculo.download = 'imagen.jpg';
          vinculo.href = window.URL.createObjectURL(blob);
          vinculo.click();
      },function(err){
          console.error(err);
      });
  };
}]);
