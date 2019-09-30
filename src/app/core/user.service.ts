import { Injectable } from '@angular/core'
import 'rxjs/add/operator/toPromise'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User, firestore } from 'firebase/app'
import { GetUsersConfig } from '../core'
import { FBUser } from './types'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class UserService {
  private currentUserBehaviour = new BehaviorSubject<FBUser>(null)
  currentUserObserver = this.currentUserBehaviour.asObservable()

  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.user.subscribe((userData) => {
      if (userData) {
        const { displayName, providerData, photoURL, uid } = userData

        this.currentUserBehaviour.next({
          image: photoURL,
          name: displayName,
          id: uid,
          provider: providerData[0].providerId,
        })
        return
      }
      this.currentUserBehaviour.next(null)
    })
  }

  forceGetCurrentUser() {
    return this.currentUserBehaviour.value
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
}
