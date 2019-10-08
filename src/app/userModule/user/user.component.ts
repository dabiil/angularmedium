import { Component, NgZone, ChangeDetectorRef } from '@angular/core'
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
export class UserComponent {
  currentUser: IUser
  userId = ''
  selectedUser: IUser = null
  isCurrentUser = false
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
  ) {
    combineLatest([
      this.userService.currentUser,
      this.route.params,
      this.route.data,
      this.postService.posts,
    ]).subscribe(async ([user, { userId }, { isCurrentUser }, posts]) => {
      if (!isCurrentUser && user && user.id === userId) {
        this.router.navigate(['/users/me'])
        return
      }

      if (!isCurrentUser && this.userId !== userId) {
        this.selectedUser = await this.userService.getUserById(userId)
      } else {
        this.selectedUser = isCurrentUser ? user : this.selectedUser
      }
      if (this.currentUser !== user && user) {
        this.descriptionInput = user.description || ''
        this.userName = user.name || ''
        this.imageUrl =
          user.image ||
          'https://avatars0.githubusercontent.com/u/18034590?s=460&v=3'
      }
      this.isCurrentUser = isCurrentUser
      this.currentUser = user
      this.userId = userId
      this.posts = posts
      chRef.detectChanges()
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

    await this.userService.updateCurrentUser(data)
    this.Editing(false)
  }

  onChangeDescription(e: any) {
    const { value }: { value: string } = e.target
    if (value.length >= 100) {
      this.descriptionError = true
    } else {
      this.descriptionError = false
    }

    const trimmed = value.replace(/\s+/g, ' ').trim()
    this.descriptionInput = trimmed
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
    console.log('hear')
    e.target.focus()
  }
  Editing(value: boolean) {
    if (!value) {
      this.userName = this.currentUser.name
      this.descriptionInput = this.currentUser.description
      this.imageUrl = this.currentUser.image
    }
    this.editing = value
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
