angular.module('balafria')
.directive('fileInput', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      scope:{
        ngModel:"="
      },
      template: '<div input-file >'+
        '<input type="file" ngf-select ng-model="ngModel" name="file" ngf-pattern="\'image/*\'" accept="image/*" ngf-max-size="20MB" />'+
        '<img ngf-thumbnail="ngModel || \'/img/thumbnails/thumbnail.png\'"/>'+
        '<label>{{nombre || "Seleccione Imagen"}}</label>'+
      '</div>',
      link: function(scope, elem, attrs) {
      elem.bind('click', function() {
        var hijo = elem.find('input')[0];
        scope.$apply(function(){
          hijo.click();
        });
      });
      elem.find('input')[0].onchange= function() {
        scope.$apply(function(){
          scope.nombre = elem.find('input')[0].files[0].name;
        });
      };
    }
  };

});
