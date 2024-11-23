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
    this.exibirFraseAleatoria();
  }

  toggleDropdown() {
    this.dropdownAberto = !this.dropdownAberto;
  }

  exibirFraseAleatoria() {
    const indice = Math.floor(Math.random() * this.frases.length);
    this.fraseAtual = this.frases[indice];
  }


  navHome() {
    this.router.navigate(['/home']);
  }

  navPerfil() {
    this.router.navigate(['/perfil']);
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
