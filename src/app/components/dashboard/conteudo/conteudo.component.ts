import { Component } from '@angular/core';
import { ProductInterface } from '../../../shared/interfaces/product-interface';

@Component({
  selector: 'app-conteudo',
  templateUrl: './conteudo.component.html',
  styleUrl: './conteudo.component.scss'
})
export class ConteudoComponent {

  product: Partial<ProductInterface> = {
    name: '',
    type: 'semente',
    price: 0,
    validade: 0,
    unidade: ''
  };

  ngOnInit(){
    this.closeModal('createProductModal')
  }

  validateForm(){

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
