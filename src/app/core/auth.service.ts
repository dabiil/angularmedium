import { Injectable } from '@angular/core'
import 'rxjs/add/operator/toPromise'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth } from 'firebase/app'

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}

  async doGoogleLogin() {
    const provider = new auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    return await this.afAuth.auth.signInWithPopup(provider)
  }

  async doRegister(value: { email: string; password: string }) {
    return await auth().createUserWithEmailAndPassword(
      value.email,
      value.password
    )
  }

  async doLogin(value: { email: string; password: string }) {
    return await auth().signInWithEmailAndPassword(value.email, value.password)
  }

  async doLogout() {
    if (auth().currentUser) {
      return await this.afAuth.auth.signOut()
    }
    throw new Error('User not logged-in')
  }
}
