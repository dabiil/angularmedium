import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User, firestore } from 'firebase/app'
import { GetUsersConfig } from '../core'
import { FBUser, FSUser } from './types'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class UserService {
  private _currentUser = new BehaviorSubject<FBUser>(null)
  public readonly currentUser = this._currentUser.asObservable()

  private _user = new BehaviorSubject<FSUser>(null)
  public user = this._user.asObservable()

  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.user.subscribe((userData) => {
      if (userData) {
        const { displayName, providerData, photoURL, uid } = userData

        this._currentUser.next({
          image: photoURL,
          name: displayName,
          id: uid,
          provider: providerData[0].providerId,
        })
        return
      }
      this._currentUser.next(null)
    })
  }

  forceGetCurrentUser() {
    return this._currentUser.value
  }

  getCurrentUserId() {
    return this._currentUser.value.id
  }
  async updateCurrentUser(value: { name: string }) {
    return await auth().currentUser.updateProfile({
      displayName: value.name,
    })
  }

  async getUsers({ skip, take }: GetUsersConfig) {
    return await firestore()
      .collection('users')
      .orderBy('id')
      .startAt(skip)
      .limit(take)
      .get()
  }

  async getUserById(userId: string) {
    try {
      const user = await firestore()
        .collection('users')
        .where('id', '==', userId)
        .get()

      this._user.next(user.docs.map((x) => x.data())[0] as FSUser)
    } catch (error) {
      console.log(error)
      this._user.next(null)
    }
  }
}
