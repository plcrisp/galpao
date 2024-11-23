import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicialComponent } from './components/inicial/inicial.component';
import { LoginComponent } from './components/auth-system/login/login.component';

const routes: Routes = [
  {path: '', component: InicialComponent},
  {path: 'login', component: LoginComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
