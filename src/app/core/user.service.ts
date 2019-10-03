import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { auth, User, firestore } from 'firebase/app'
import { GetUsersConfig } from '../core'
import { FSUser, IUpdateCurrentUserProps } from './types'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _currentUser = new BehaviorSubject<FSUser>(null)
  public readonly currentUser = this._currentUser.asObservable()

  private _selectedUser = new BehaviorSubject<FSUser>(null)
  public readonly selectedUser = this._selectedUser.asObservable()

  private _users = new BehaviorSubject<FSUser[]>([])
  public readonly users = this._users.asObservable()

  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.user.subscribe(async (userData) => {
      if (userData) {
        const { uid } = userData

        const user = await this.getUserById(uid)
        this._currentUser.next(user)

        return
      }
      this._currentUser.next(null)
    })
  }

  forceGetCurrentUser() {
    return this._currentUser.value
  }

  getCurrentUserId() {
    try {
      return this._currentUser.value.id
    } catch {
      return null
    }
  }

  async updateCurrentUser(value: IUpdateCurrentUserProps) {
    const id = this.getCurrentUserId()
    if (!id) {
      console.log('user not authentificated')
    }

    try {
      const authUser = this.afAuth.auth.currentUser
      if (!authUser) {
        console.log('user not authentificated')
      }

      await firestore()
        .collection('users')
        .doc(id)
        .set(value)

      const newData = await firestore()
        .collection('users')
        .doc(id)
        .get()

      const newUser = newData.data() as FSUser
      this._currentUser.next(newUser)

      this._users.next([...this._users.value, newUser])
    } catch (error) {
      console.log(error)
    }
  }

  async createNewUser(user: FSUser) {
    await firestore()
      .collection('users')
      .doc(user.id)
      .set(user)
    this._users.next([...this._users.value, user])
  }

  async getUsers({ lastUserId, take }: GetUsersConfig) {
    let query = firestore()
      .collection('users')
      .orderBy('id')

    if (lastUserId !== null) {
      query = query.startAfter(lastUserId)
    }
    query = query.limit(take)
    const data = await query.get()

    const users = data.docs.map((x) => x.data() as FSUser)

    this._users.next([...this._users.value, ...users])
    return users
  }

  async getUserById(userId: string): Promise<FSUser> {
    try {
      const data = await firestore()
        .collection('users')
        .doc(userId)
        .get()
      return data.data() as FSUser
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
