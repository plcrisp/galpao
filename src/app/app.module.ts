import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicialComponent } from './components/inicial/inicial.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { LoginComponent } from './components/auth-system/login/login.component';
import { CadastroComponent } from './components/auth-system/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './components/auth-system/recuperar-senha/recuperar-senha.component';

@NgModule({
  declarations: [
    AppComponent,
    InicialComponent,
    LoginComponent,
    CadastroComponent,
    RecuperarSenhaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"gala-f4d76","appId":"1:126284747656:web:b317dd3890c6f4d341e03d","storageBucket":"gala-f4d76.firebasestorage.app","apiKey":"AIzaSyDiBkgPz32nCqiLrdJWCBSsnr2V2Mae0g4","authDomain":"gala-f4d76.firebaseapp.com","messagingSenderId":"126284747656","measurementId":"G-63N3CCYMFM"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
