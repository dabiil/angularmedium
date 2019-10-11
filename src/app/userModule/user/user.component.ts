import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  IUser,
  UserService,
  AuthService,
  PostService,
  IPost,
  IUserUpdateProps,
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
    private postService: PostService,
    private zone: NgZone
  ) {}
  ngOnInit() {
    combineLatest([this.userService.currentUser, this.route.params]).subscribe(
      ([user, { userId }]) => {
        this.zone.run(() => {
          this.currentUser = user

          this.isCurrentUser = !!(user && user.id === userId)
        })
      }
    )
    this.route.params.subscribe(async ({ userId }) => {
      const user = await this.userService.getUserById(userId)
      await this.postService.updateCurrentUserPosts(userId)

      this.zone.run(() => {
        this.selectedUser = user
        this.userId = userId
      })
    })
    this.postService.posts.subscribe((x) => {
      this.zone.run(() => {
        console.log(x)
        this.posts = x
      })
    })
  }
  async onSaveSettings() {
    const data: Partial<IUser> = {}
    if (this.currentUser.name !== this.userName && this.userName !== '') {
      data.name = this.userName
    }
    if (
      this.currentUser.description !== this.descriptionInput &&
      !this.descriptionError
    ) {
      data.description = this.descriptionInput
    }

    const newUser = await this.userService.updateCurrentUser({
      ...data,
      image: this.imageBlob || data.image,
    } as IUserUpdateProps)
    this.zone.run(() => {
      this.selectedUser = newUser
      this.Editing(false)
    })
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
      this.imageUrl = this.currentUser.image as string
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
  getActivity() {
    if (!this.selectedUser.lastActivity) {
      return null
    }
    return new Date(this.selectedUser.lastActivity).toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
    })
  }
}
