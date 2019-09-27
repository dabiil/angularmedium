import { Injectable } from '@angular/core'
import 'rxjs/add/operator/toPromise'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User, firestore } from 'firebase/app'
import { GetUsersConfig } from '../core'

@Injectable()
export class UserService {
  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {}

  getCurrentUser() {
    return new Promise<User>((resolve, reject) => {
      auth().onAuthStateChanged((user) => {
        user ? resolve(user) : reject('No user logged in')
      })
    })
  }

  async updateCurrentUser(value: { name: string }) {
    return await auth().currentUser.updateProfile({
      displayName: value.name,
    })
  }

  private getUserQuery() {
    return firestore()
      .collection('users')
      .orderBy('id')
  }

  async getUsers({ skip, take }: GetUsersConfig) {
    return await this.getUserQuery()
      .startAt(skip)
      .limit(take)
      .get()
  }
}
