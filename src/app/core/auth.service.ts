import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, firestore } from 'firebase/app'
import { UserService } from './user.service'

@Injectable()
export class AuthService {
  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService
  ) {}

  async doGoogleLogin() {
    const provider = new auth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    const user = await this.afAuth.auth.signInWithPopup(provider)

    if (user.additionalUserInfo.isNewUser) {
      const {
        user: { displayName, photoURL, uid },
      } = user
      await this.userService.createNewUser({
        id: uid,
        image: photoURL,
        name: displayName,
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
