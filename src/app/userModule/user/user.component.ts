import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  IUser,
  UserService,
  AuthService,
  UserUpdateData,
  PostService,
  IPost,
} from '../../core'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'app-page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss'],
})
export class UserComponent implements OnInit {
  currentUser: IUser
  userId = ''
  selectedUser: IUser = undefined
  isCurrentUser = null
  editing = false
  descriptionError = false
  descriptionInput = ''
  userName = ''
  size = 2
  imageUrl = ''
  imageBlob: File

  posts: IPost[] = []
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute, // private location: Location, // private fb: FormBuilder
    private router: Router,
    private chRef: ChangeDetectorRef,
    private postService: PostService
  ) {}
  ngOnInit() {
    combineLatest([this.userService.currentUser, this.route.params]).subscribe(
      ([user, { userId }]) => {
        this.currentUser = user

        this.isCurrentUser = !!(user && user.id === userId)
        this.chRef.detectChanges()
        console.log(user, this.isCurrentUser)
      }
    )
    this.route.params.subscribe(async ({ userId }) => {
      const user = await this.userService.getUserById(userId)
      const posts = await this.postService.updateCurrentUserPosts(userId)
      this.selectedUser = user
      this.posts = posts
      this.userId = userId
      this.chRef.detectChanges()
      console.log(userId, user, posts)
    })
    this.postService.posts.subscribe((x) => {
      this.posts = x
      this.chRef.detectChanges()
    })
  }
  async onSaveSettings() {
    const data: Partial<UserUpdateData> = {}
    if (this.currentUser.name !== this.userName && this.userName !== '') {
      data.name = this.userName
    }
    if (
      this.currentUser.description !== this.descriptionInput &&
      !this.descriptionError
    ) {
      data.description = this.descriptionInput
    }
    if (this.imageBlob) {
      data.image = this.imageBlob
    }

    this.selectedUser = await this.userService.updateCurrentUser(data)
    this.Editing(false)
    this.chRef.detectChanges()
  }

  onChangeDescription(e: any) {
    const { value }: { value: string } = e.target
    if (value.length > 250) {
      this.descriptionError = true
    } else {
      this.descriptionError = false
    }

    const trimmed = value.replace(/\s+/g, ' ').trim()
    this.descriptionInput = trimmed
    this.chRef.detectChanges()
  }
  onChangeUserName({ target }: any) {
    const { value = '' } = target
    this.userName = value.trim()
  }

  onPress(e: any, element: HTMLElement) {
    if (e.code === 'Enter' && this.size !== 10) {
      this.size++
    }
  }
  isButtonDisabled() {
    return this.descriptionError || this.userName === ''
  }
  onInputHover(e: any) {
    e.target.focus()
  }
  Editing(value: boolean) {
    if (value) {
      this.userName = this.currentUser.name
      this.descriptionInput = this.currentUser.description
      this.imageUrl = this.currentUser.image
    }
    this.editing = value
    this.chRef.detectChanges()
  }

  inputImage({ target }) {
    const { files } = target
    const avatar: File = files[0]

    const reader = new FileReader()
    reader.readAsDataURL(avatar)
    reader.onload = (e) => {
      console.log(reader.result)
      this.imageUrl = reader.result.toString()
    }
    this.imageBlob = avatar
  }
}
