import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, firestore } from 'firebase/app'

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}

  async doGoogleLogin() {
    try {
      const provider = new auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      const user = await this.afAuth.auth.signInWithPopup(provider)

      if (user.additionalUserInfo.isNewUser) {
        await firestore()
          .collection('users')
          .add({
            id: user.user.uid,
            name: user.user.displayName,
            image: user.user.photoURL,
          })
      }
      return user
    } catch (error) {
      console.log(error)
    }
  }

  async doLogout() {
    if (auth().currentUser) {
      return await this.afAuth.auth.signOut()
    }
    throw new Error('User not logged-in')
  }
}
