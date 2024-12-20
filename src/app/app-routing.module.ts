import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicialComponent } from './components/inicial/inicial.component';
import { LoginComponent } from './components/auth-system/login/login.component';
import { CadastroComponent } from './components/auth-system/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './components/auth-system/recuperar-senha/recuperar-senha.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { ConteudoComponent } from './components/dashboard/conteudo/conteudo.component';

const routes: Routes = [
  {path: '', component: InicialComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cadastro', component: CadastroComponent},
  {path: 'recuperar-senha', component: RecuperarSenhaComponent},
  {path: 'home', component: HomeComponent},
  {path: 'produtos', component: ConteudoComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
