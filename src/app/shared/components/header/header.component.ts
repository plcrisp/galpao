import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserInterface } from '../../interfaces/user-interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showLogoutModal: boolean=false;

  frases: string[] = [
    "Cuidando do futuro, uma muda de cada vez.",
    "Sua gestão de estoque com eficiência e segurança.",
    "Conectando sementes de hoje ao crescimento de amanhã.",
    "Controle total do seu galpão em um clique."
  ];

  fraseAtual: string = '';

  isAdmin: boolean = false;
  uid: string = ''; // id do usuário logado

  user: UserInterface | null = null;

  dropdownAberto: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    ) { }

  ngOnInit(){
    this.user = this.auth.getLocalStorage();
  }

  toggleDropdown() {
    this.dropdownAberto = !this.dropdownAberto;
  }


  navHome() {
    this.router.navigate(['/home']);
  }

  navPerfil() {
    this.router.navigate(['/perfil']);
  }

  navProdutos() {
    this.router.navigate(['/produtos']);
  }
  
  navRastrearEntrega() {
    this.router.navigate(['/rastrear-entrega']);
  }
  

  openLogoutModal() {
    this.showLogoutModal=true;
  }

  cancelLogout() {
    this.showLogoutModal=false;
  }

  confirmLogout() {
    this.auth.logout();
    console.log('Usuário deslogado.');
  }
}
