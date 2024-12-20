import { Component } from '@angular/core';
import { Warehouse } from '../../../shared/interfaces/warehouse-interface';
import { Firestore } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { GeocodeService } from '../../../shared/services/geocode.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  display: any;
  center: google.maps.LatLngLiteral = {
      lat: -14.2350,
      lng: -51.9253
  };
  zoom = 4;

  galpao: Partial<Warehouse> = {
    name: '',
    latitude: 0,
    longitude: 0,
    capacity: 0,
  };
  galpoes: Warehouse[] = [];
  filteredGalpoes: Warehouse[] = [];
  searchQuery: string = '';

  constructor(private firestore: AngularFirestore, private geocoding: GeocodeService){ }


  ngOnInit(){
    this.getAllWarehouses();
    this.closeModal('createWarehouseModal');
  }

  salvarGalpao() {
    const { latitude, longitude } = this.galpao;

    if (latitude !== undefined && longitude !== undefined) {
      this.geocoding.reverseGeocode(latitude, longitude).subscribe(
        (response) => {
          const components = response.results[0].components;
          const warehouse: Warehouse = {
            ...this.galpao,
            city: components.city || components.town || components.village,
            state: components.state,
            country: components.country,
            createDate: firebase.firestore.Timestamp.now(),
          } as Warehouse;

          this.firestore
            .collection<Warehouse>('warehouses')
            .add(warehouse)
            .then(() => {
              console.log('Galpão registrado com sucesso!');
              this.galpao = { name: '', latitude: 0, longitude: 0, capacity: 0 }; // Reseta o formulário
            })
            .catch((error) => {
              console.error('Erro ao registrar o galpão:', error);
            });
        },
        (error: any) => {
          console.error('Erro ao obter informações de geocodificação:', error);
        }
      );
    } else {
      console.error('Latitude e longitude são obrigatórios.');
    }
    this.closeModal('createWarehouseModal');
  }

  getAllWarehouses() {
    this.firestore
      .collection<Warehouse>('warehouses')
      .valueChanges({ idField: 'id' })
      .subscribe(
        (warehouses) => {
          this.galpoes = warehouses.map((warehouse) => ({
            ...warehouse,
            createDate: warehouse.createDate.toDate(), // Converte o Timestamp para Date
            // Verifica se latitude e longitude são números válidos
            latitude: !isNaN(warehouse.latitude) ? warehouse.latitude : 0,
            longitude: !isNaN(warehouse.longitude) ? warehouse.longitude : 0,
          }));
          this.filteredGalpoes = this.galpoes;
        },
        (error) => {
          console.error('Erro ao carregar os galpões:', error);
        }
      );
  }

  filterGalpoes(): void {
    const query = this.searchQuery.trim().toLowerCase();
    const sanitizedQuery = query.replace(/[\.\-]/g, '');
    if (sanitizedQuery === '') {
      this.filteredGalpoes = this.galpoes;
    } else {
      this.filteredGalpoes = this.galpoes.filter(galpao => {
        const nameMatch = galpao.name ? galpao.name.toLowerCase().includes(sanitizedQuery) : false;
        return nameMatch;
      });
    }
  }



  validateForm(): boolean{
    return this.galpao.name == '' || this.galpao.latitude == 0 || this.galpao.longitude == 0 || this.galpao.capacity == 0;
  }



  moveMap(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  openModal(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      modalElement.classList.remove('hidden');
    }
  }

  closeModal(id: string) {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      modalElement.classList.add('hidden');
    }
  }
}
