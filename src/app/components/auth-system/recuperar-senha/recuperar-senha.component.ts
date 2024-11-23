import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.scss'
})
export class RecuperarSenhaComponent {

  email : string = '';
  modalVerification : boolean = false;

  constructor (private auth: AuthService, private router: Router) {}

  ngOnInit(): void { }

  redefinirSenha() {
    this.auth.redefinirSenha(this.email);
    this.email = '';
  }

  openModal() {
    this.modalVerification=true;
    this.redefinirSenha();
  }

  closeModal() {
    this.modalVerification=false;
    this.router.navigate(['/login']);
  }


}
