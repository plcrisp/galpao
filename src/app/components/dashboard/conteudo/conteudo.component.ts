import { Component } from '@angular/core';
import { ProductInterface } from '../../../shared/interfaces/product-interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-conteudo',
  templateUrl: './conteudo.component.html',
  styleUrl: './conteudo.component.scss'
})
export class ConteudoComponent {

  product: Partial<ProductInterface> = {
    name: '',
    type: '',
    price: 0,
    validade: 0,
    unidade: ''
  };

  products?: Observable<ProductInterface[]>;

  constructor(private firestore: AngularFirestore){
    this.getAllProducts();
  }

  ngOnInit(){
    this.closeModal('createProductModal')
  }

  validateForm(): boolean {
    return (
      !this.product.name || // Nome não preenchido
      !this.product.type || // Tipo não selecionado
      (this.product.price ?? 0) <= 0 || // Preço válido
      (this.product.validade ?? 0) <= 0 || // Validade válida
      !this.product.unidade // Unidade não preenchida
    );
  }

  setType(type: string): void {
    if (this.product.type === type) {
      this.product.type = ''; // Desmarcar se clicar novamente no mesmo checkbox
    } else {
      this.product.type = type; // Marcar a seleção
    }
  }

  saveProduct() {
    const { price, validade, name, type, unidade } = this.product;
  
    // Verifica se os campos obrigatórios são preenchidos
    if (price !== undefined && validade !== undefined && name && type && unidade) {
      const newProduct: ProductInterface = {
        name: name || '',          
        type: type || '',          
        price: price || 0,         
        validade: validade || 0,   
        unidade: unidade || '',    
        createdAt: firebase.firestore.Timestamp.now(),  
      };
  
      this.firestore
        .collection<ProductInterface>('products')  // Salva na coleção 'products'
        .add(newProduct)
        .then(() => {
          console.log('Produto registrado com sucesso!');
          // Reseta os campos do formulário
          this.product = { name: '', type: '', price: 0, validade: 0, unidade: '' };
          this.closeModal('createProductModal')
        })
        .catch((error) => {
          console.error('Erro ao registrar o produto:', error);
        });
    } else {
      console.error('Todos os campos obrigatórios (nome, tipo, preço, validade e unidade) são necessários.');
    }
  }

  getAllProducts(): void {
    this.products = this.firestore
      .collection<ProductInterface>('products')  // Acessa a coleção 'products'
      .valueChanges();  // Retorna os dados da coleção como um Observable
  }

  ordenarPor(campo: 'name' | 'type'): void {
    this.products = this.firestore
      .collection<ProductInterface>('products', ref => ref.orderBy(campo))  // Ordena pela chave 'name' ou 'type'
      .valueChanges();  // Retorna os dados da coleção como um Observable
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
