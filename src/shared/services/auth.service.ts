import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { take, first } from 'rxjs/operators';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import * as jose from 'jose';
import { environment } from '../../environments/environment';
import { UserInterface } from '../interfaces/user-interface';
import firebase from 'firebase/compat/app';
import { getDownloadURL, getStorage, uploadBytes, ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;

  // MODAIS

  showConfirmEmailModal: boolean = false;
  showBlockedModal: boolean = false;
  showWrongModal: boolean = false;
  showWrongEmailModal: boolean = false;
  showSucessModal: boolean = false;

  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }

  getCurrentUser(): Observable<firebase.User | null> {
    return this.fireauth.authState; // Retorna um observable com o estado do usuário
  }

  getCurrentUserUID(): Observable<string | null> {
    return this.fireauth.authState.pipe(
      map(user => user ? user.uid : null)
    );
  }

  //método para realizar o logout da sessao atual
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigate(['/']);
    }).catch(err => {
      alert(err.message);
    });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token'); // ou outra verificação de token/session
    return !!token; // retorna true se o token existir
  }

  cadastro(name: string, email: string, password: string, confirmPassword: string, photo: File) {
    if (password !== confirmPassword) { // Verifica se as senhas coincidem
      alert('As senhas não coincidem. Por favor, tente novamente.');
      return;
    }

      this.fireauth.createUserWithEmailAndPassword(email, password)
        .then(async userCredential => {
          const user = userCredential.user;
          if (user) {
            // Salva dados do usuário no Firestore
            const createdAt = firebase.firestore.FieldValue.serverTimestamp();

            const storage = getStorage(); // Obtém a instância do storage
            const photoRef = ref(storage, `users/${user.uid}/profile.jpg`); // Referência ao arquivo de imagem

            // Faz o upload da imagem
            await uploadBytes(photoRef, photo);
            const photoUrl = await getDownloadURL(photoRef); // Obtém a URL da imagem

            await user.updateProfile({
              displayName: name,
              photoURL: photoUrl || null
            });

            const userData: UserInterface = {
              name: name,
              email: email,
              createdAt: createdAt,
              lastLogin: createdAt,
              photoPath: photoUrl,
            };

            this.showSucessModal = true;

            await this.salvarDadosUsuario(user.uid, userData);
            user.sendEmailVerification();
          }
        })
        .catch(error => {
          console.error('Erro ao criar usuário:', error);
          alert('Erro ao criar conta: ' + error.message);
        });
  }
  //método para redefinir a senha do usuario
  redefinirSenha(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      alert('Verifique o seu email para redefinir a sua senha.');
      this.router.navigate(['/login']);
    }).catch(err => {
      console.error('Erro ao enviar email de redefinição de senha:', err);
      alert('Algo deu errado: ' + err.message);
    });
  }

  //método para realizar o login do usuario
  login(email: string, password: string, rememberMe: boolean) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(async res => {
        if (res.user?.emailVerified) {
          const userDoc = await this.firestore.collection('users').doc(res.user?.uid).get().toPromise();
          const userData = userDoc?.data() as { isActive: boolean };

          // Verifica se o usuário está ativo
          if (userData) {

            // Atualiza o atributo lastLogin com a data e hora atual do servidor
            await this.firestore.collection('users').doc(res.user?.uid).update({
              lastLogin: firebase.firestore.FieldValue.serverTimestamp() // Atualiza o lastLogin com o timestamp do servidor
            });

            // Procura o usuário no Firestore para gerar o token
            this.firestore.collection('users').ref.where('email', '==', res.user.email).get().then(async (u: any) => {
              const token = await this.generateJWTToken(u.docs[0].data()); // obtém o token JWT do Firebase

              // Verifica se "remember Me" está ativado e armazena o token no localStorage ou sessionStorage
              if (rememberMe) {
                this.setJWTToken(token); // armazena o token JWT no localStorage
              } else {
                sessionStorage.setItem('token', token); // armazena o token JWT no sessionStorage até que o navegador seja fechado
              }

              this.router.navigate(['/home']);
            });
          } else {
            // Se o usuário está desativado, exibe uma mensagem de alerta
            this.openBlockedModal();
          }
        } else {
          // Caso o email não tenha sido verificado
          this.openConfirmEmailModal();
        }
      })
      .catch(err => {
        this.openWrongModal();
      });
  }



  //método para salvar dados do usuario no firestore
  salvarDadosUsuario(uid: string, user: UserInterface) {
    return this.firestore.collection(`users`).doc(uid).set(user);
  }

  //método para fazer login com o google
  async googleSignIn() {
    try {
      // Inicia o processo OAuth
      const provider = new GoogleAuthProvider();
      const result: any = await this.fireauth.signInWithPopup(provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      if (user && user.emailVerified) {

          // Procura o usuário no Firestore
          const userSnapshot = await this.firestore.collection('users').ref
            .where('email', '==', user.email)
            .get();

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data() as { isActive: boolean };

            // Verifica se o usuário está ativo
            if (userData.isActive) {
              // Atualiza o timestamp do último login
              await this.firestore.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
              });

              const token = await this.generateJWTToken(userSnapshot.docs[0].data());
              this.setJWTToken(token);
              this.router.navigate(['/home']);
            } else {
              // Se o usuário está desativado
              this.openBlockedModal();
              await this.fireauth.signOut();
            }
          } else {
            // Se o usuário não está cadastrado, cria um novo registro
            await this.cadastrarNovoUsuarioComGoogle(user);
            this.router.navigate(['/home']);
          }
      } else {
        // Caso o e-mail não tenha sido verificado
        this.openConfirmEmailModal();
        await this.fireauth.signOut();
      }
    } catch (err) {
      // Em caso de erro
      this.openWrongModal();
      await this.fireauth.signOut();
    }
  }

  // Método para cadastrar o novo usuário no Firestore
  async cadastrarNovoUsuarioComGoogle(user: any) {
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();

    const userData: UserInterface = {
      name: user.displayName || 'Usuário sem nome',
      email: user.email,
      createdAt: createdAt,
      lastLogin: createdAt,
      photoPath: user.photoURL || '',
    };

    await this.firestore.collection('users').doc(user.uid).set(userData);

    const token = await this.generateJWTToken(userData);
    this.setJWTToken(token);
  }

  //método para definir o token JWT no localStorage
  setJWTToken(token: string) {
    localStorage.setItem('token', token); //armazena o token JWT no localStorage
    this.token = token;
  }

  //método para obter o token JWT
  getToken(): string | null {
    return this.token || localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  //método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  //método para validar o token JWT
  public async validateToken(token: string): Promise<boolean> {
    try {
      const secretKey = new TextEncoder().encode(environment.secret);
      await jose.jwtVerify(token, secretKey, {
        issuer: 'urn:example:issuer',
        audience: 'urn:example:audience',
      });
      return true;
    } catch (err) {
      console.error('Token inválido:', err);
      return false;
    }
  }

  //método para obter o usuário armazenado no token JWT
  public decript() {
    const token = this.getToken();
    if (token) {
      try {
        return Object(jose.decodeJwt(token))
      } catch (err) {
        console.error('Erro ao decodificar o token:', err);
        return null;
      }
    }
    return null;
  }

  public getLocalStorage(): UserInterface {
    return this.decript()
  }

  public async generateJWTToken(user: any): Promise<string> {
    const alg = 'HS256';
    const secretKey = new TextEncoder().encode(environment.secret);
    const jwt = await new jose.SignJWT(user)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience('urn:example:audience')
      .sign(secretKey);
    return jwt;
  }

  public async updateJWTToken(user: any): Promise<void> {
    const newToken = await this.generateJWTToken(user);
    this.setJWTToken(newToken);
  }

  openConfirmEmailModal() {
    this.showConfirmEmailModal = true;
  }

  openBlockedModal() {
    this.showBlockedModal = true;
  }

  openWrongModal() {
    this.showWrongModal = true;
  }

  closeModal() {
    this.showConfirmEmailModal = false;
    this.showBlockedModal = false;
    this.showWrongModal = false;
    this.showWrongEmailModal = false;
    this.showSucessModal = false;
  }
}
