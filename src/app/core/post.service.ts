import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireStorage } from '@angular/fire/storage'
import { auth, User, firestore } from 'firebase/app'
import { UserService } from './user.service'
import { IPost } from './types'
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

  async getPostById(postId: string): Promise<IPost> {
    try {
      const document = await firestore()
        .collection('posts')
        .doc(postId)
        .get()
      return document.data() as IPost
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async updateSelectedPost(postId: string): Promise<IPost> {
    const post = await this.getPostById(postId)
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
      console.log(postDocuments)
      return postDocuments.docs.map((x) => x.data()) as IPost[]
    } catch (error) {
      console.log(error)
      return []
    }
  }
  async updateCurrentUserPosts(userId: string) {
    const posts = await this.getPostsByUser(userId)
    this._posts.next(posts)
    return posts
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
      console.log(newPost)
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
