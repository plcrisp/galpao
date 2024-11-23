import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  display: any;
  center: google.maps.LatLngLiteral = {
      lat: -22.4238234,
      lng: -45.4524156
  };
  zoom = 12;

  markerPosition: google.maps.LatLngLiteral = { lat: -22.4238234, lng: -45.4524156 };

  moveMap(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }
}
