window.CustomMarker = function(cons) {
  this.latlng = cons.position;
  this.args = cons;
  this.setMap(cons.map);
};

window.CustomMarker.prototype = new google.maps.OverlayView();

window.CustomMarker.prototype.draw = function() {

  var self = this;

  var div = this.div;

  if (!div) {

    div = this.div = document.createElement('div');

    div.className = 'marker';

    div.style.position = 'absolute';
    div.style.cursor = 'pointer';
    div.style.width = '40px';
    div.style.height = '40px';
    div.classList.add("markerLayer");
    div.onclick = self.args.click;

    if (typeof(self.args.marker_id) !== 'undefined') {
      div.dataset.marker_id = self.args.marker_id;
    }

    if (typeof(self.args.img) !== 'undefined') {
      div  = self.armarImagen(self.args.img,div);
    }

    google.maps.event.addDomListener(div, "click", function(event) {
      google.maps.event.trigger(self, "click");
    });

    var panes = this.getPanes();
    panes.overlayImage.appendChild(div);
  }

  var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

  if (point) {
    div.style.left = point.x + 'px';
    div.style.top = point.y + 'px';
  }
};

window.CustomMarker.prototype.remove = function() {
  if (this.div) {
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
};

window.CustomMarker.prototype.getPosition = function() {
  return this.latlng;
};
window.CustomMarker.prototype.armarImagen = function(img,div){
  div.innerHTML='<img src="'+img+'"></img>';
  return div;
};
