import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, firestore } from 'firebase/app'

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}

  async doGoogleLogin() {
    const provider = new auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    const user = await this.afAuth.auth.signInWithPopup(provider)
    const {
      user: { displayName, photoURL, uid },
    } = user

    if (user.additionalUserInfo.isNewUser) {
      await firestore()
        .collection('users')
        .add({
          id: uid,
          name: displayName,
          image: photoURL,
        })
    }
    return user
  }

  async doLogout() {
    if (auth().currentUser) {
      return await this.afAuth.auth.signOut()
    }
    throw new Error('User not logged-in')
  }
}
