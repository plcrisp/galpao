import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string ='';
  password: string = '';
  rememberMe: boolean = false;

  // MODAIS

  showPasswordModal: boolean = false;
  showEmailModal: boolean = false;

  constructor (public auth: AuthService, private router: Router) {
  }

  login() {
    if(this.email == '') {
      this.openEmailModal();
      return;
    }

    if(this.password == '') {
      this.openPasswordModal();
      return;
    }

    this.auth.login(this.email,this.password, this.rememberMe);

  }

  cadastrar () {
    this.router.navigate(['/cadastro']);
  }

  openPasswordModal() {
    this.showPasswordModal = true;
  }

  openEmailModal() {
    this.showEmailModal = true;
  }

  closeModal() {
    this.showEmailModal = false;
    this.showPasswordModal = false;
  }
}
