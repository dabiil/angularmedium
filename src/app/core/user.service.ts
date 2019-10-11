import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireStorage } from '@angular/fire/storage'
import { auth, User, firestore } from 'firebase/app'
import { GetUsersConfig } from '../core'
import { IUser, IUserUpdateProps } from './types'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _currentUser = new BehaviorSubject<IUser>(null)
  public readonly currentUser = this._currentUser.asObservable()

  private _users = new BehaviorSubject<IUser[]>([])
  public readonly users = this._users.asObservable()

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public storage: AngularFireStorage
  ) {
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

  getCurrentUserId(): string | null {
    try {
      return this._currentUser.value.id
    } catch {
      return null
    }
  }

  async updateCurrentUser(value: IUserUpdateProps) {
    const currentUser = this.forceGetCurrentUser()
    if (!currentUser || !currentUser.id) {
      console.log('user not authentificated')
    }
    const { id } = currentUser
    try {
      if (value.image && value.image instanceof File) {
        value.image = await this.updateImage(value.image, id)
      }

      await firestore()
        .collection('users')
        .doc(id)
        .update(value)

      const updatedUser = {
        ...currentUser,
        ...value,
      } as IUser

      this._currentUser.next(updatedUser)

      this._users.next([
        ...this._users.value.filter((x) => x.id !== id),
        updatedUser,
      ])
      return updatedUser
    } catch (error) {
      console.log(error)
      return null
    }
  }

  private async updateImage(image: File, userId: string) {
    const avatarRef = this.storage.storage.ref(`avatars/${userId}`)
    try {
      await avatarRef.delete()
    } catch (error) {
      console.log(error)
    }

    const uploaded = await avatarRef.put(image)
    return (await uploaded.ref.getDownloadURL()) as string
  }

  async createNewUser(user: Partial<IUser>) {
    await firestore()
      .collection('users')
      .doc(user.id)
      .set(user)
    this._users.next([...this._users.value, user as IUser])
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

    const users = data.docs.map((x) => x.data() as IUser)

    this._users.next([...this._users.value, ...users])
    return users
  }

  async getUserById(userId: string): Promise<IUser> {
    try {
      const data = await firestore()
        .collection('users')
        .doc(userId)
        .get()
      return (data.data() as IUser) || null
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
