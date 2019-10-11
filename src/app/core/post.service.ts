import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireStorage } from '@angular/fire/storage'
import { auth, User, firestore } from 'firebase/app'
import { UserService } from './user.service'
import { IPost, IUser } from './types'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private _selectedPost = new BehaviorSubject<IPost>(null)
  public readonly selectedPost = this._selectedPost.asObservable()

  private _posts = new BehaviorSubject<IPost[]>([])
  public readonly posts = this._posts.asObservable()

  constructor(
    public userService: UserService,
    public afAuth: AngularFireAuth,
    public storage: AngularFireStorage
  ) {}

  async getAllPostsWithAuthor() {
    const docs = await firestore()
      .collection('posts')
      .get()
    const posts = docs.docs.map((x) => x.data()) as IPost[]

    const userDocs = await firestore()
      .collection('users')
      .get()
    const users = userDocs.docs.map((x) => x.data()) as IUser[]
    posts.forEach((x) => {
      const user = users.find((u) => u.id === x.author)
      if (user) {
        x.author = user
      } else {
        console.log('wtf, who writed this post')
      }
    })
    this._posts.next(posts)
  }
  async getPostById(postId: string): Promise<IPost> {
    try {
      const document = await firestore()
        .collection('posts')
        .doc(postId)
        .get()
      const data = document.data() as IPost
      console.log(data)
      data.author = await this.getAuthor(data.author as string)
      return data
    } catch (error) {
      console.log(error)
      return null
    }
  }

  private async getAuthor(userId: string) {
    const current = this.userService.forceGetCurrentUser()
    if (current && userId === current.id) {
      return current
    }
    return await this.userService.getUserById(userId)
  }
  async updateSelectedPost(postId: string): Promise<IPost> {
    const post = await this.getPostById(postId)
    console.log(post)
    this._selectedPost.next(post)
    return post
  }

  async getPostsByUser(userId: string): Promise<IPost[]> {
    try {
      const postDocuments = await firestore()
        .collection('posts')
        .orderBy('createdAt')
        .where('author', '==', userId)
        .get()

      const posts = postDocuments.docs.map((x) => x.data()) as IPost[]
      const author = await this.getAuthor(userId)
      posts.forEach((x) => (x.author = author))
      return posts
    } catch (error) {
      console.log(error)
      return []
    }
  }
  async updateCurrentUserPosts(userId: string) {
    this._posts.next(await this.getPostsByUser(userId))
  }

  async editPost(editablePost: Partial<IPost>): Promise<IPost> {
    try {
      const currentUserId = this.userService.getCurrentUserId()

      if (currentUserId === null) {
        throw new Error('User not authenticated')
      }

      const currentPost = this._selectedPost.value

      if (!editablePost.id || currentPost.id !== editablePost.id) {
        throw new Error('post id error')
      }

      if (editablePost.author !== currentUserId) {
        throw new Error('this post not this user')
      }

      await firestore()
        .collection('posts')
        .doc(editablePost.id)
        .update(editablePost)

      const newPost: IPost = {
        ...currentPost,
        ...editablePost,
      }
      this._selectedPost.next(newPost)
      return newPost
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async createNewPost(newPost: IPost): Promise<IPost> {
    try {
      const currentUserId = this.userService.getCurrentUserId()

      if (currentUserId === null) {
        throw new Error('User not authenticated')
      }

      const newPostDoc = firestore()
        .collection('posts')
        .doc()

      newPost.id = newPostDoc.id
      newPost.author = currentUserId
      await newPostDoc.set(newPost)
      return newPost
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
