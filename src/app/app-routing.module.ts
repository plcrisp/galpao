import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicialComponent } from './components/inicial/inicial.component';
import { LoginComponent } from './components/auth-system/login/login.component';
import { CadastroComponent } from './components/auth-system/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './components/auth-system/recuperar-senha/recuperar-senha.component';

const routes: Routes = [
  {path: '', component: InicialComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cadastro', component: CadastroComponent},
  {path: 'recuperar-senha', component: RecuperarSenhaComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
