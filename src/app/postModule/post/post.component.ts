import { Component, NgZone, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IUser, UserService, AuthService, PostService, IPost } from '../../core'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'app-post',
  templateUrl: 'post.component.html',
  styleUrls: ['post.scss'],
})
export class PostComponent {
  postId: string = null
  currentUser: IUser = null
  post: IPost = null
  selectedAuthor: IUser = null
  editable = false
  inputContent = ''
  preview = true
  isNewPost = false
  inputTitle = ''
  inputDescroption = ''
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private chRef: ChangeDetectorRef,
    private postService: PostService,
    private zone: NgZone
  ) {
    this.userService.currentUser.subscribe((x) => (this.currentUser = x))
    this.route.params.subscribe(async ({ postId }) => {
      if (!postId) {
        return
      }
      await this.postService.updateSelectedPost(postId)

      this.zone.run(() => {
        this.postId = postId
      })
    })
    this.postService.selectedPost.subscribe(async (post) => {
      if (!post) {
        return
      }
      const author = await this.userService.getUserById(post.author)
      this.zone.run(() => {
        this.selectedAuthor = author
        this.post = post
      })
    })
    this.route.data.subscribe(({ isNewPost }) => {
      this.zone.run(() => {
        if (isNewPost) {
          this.editable = true
          this.preview = false
          this.inputTitle = ''
          this.inputDescroption = ''
          this.inputContent = ''
        } else {
          this.editable = false
          this.preview = false
        }
        this.isNewPost = isNewPost
      })
    })
  }
  onEdit(value: boolean) {
    this.editable = value
  }
  onInput(
    { target: { value = '' } },
    type: 'title' | 'description' | 'content'
  ) {
    switch (type) {
      case 'title':
        {
          this.inputTitle = value
        }
        break
      case 'description':
        {
          this.inputDescroption = value
        }
        break
      case 'content':
        {
          this.inputContent = value
        }
        break
    }
  }
  onTogglePreview() {
    this.preview = !this.preview
  }
  startEditing() {
    if (this.post) {
      this.inputTitle = this.post.title
      this.inputDescroption = this.post.description
      this.inputContent = this.post.content
      this.editable = true
    }
  }

  // return true if valid
  validateSaveButton(): boolean {
    const post = this.post || ({} as IPost)
    const validationData = [
      {
        new: this.inputContent,
        prev: post.content,
      },
      {
        new: this.inputDescroption,
        prev: post.description,
      },
      {
        new: this.inputTitle,
        prev: post.title,
      },
    ]
    const emtyValidator = () =>
      validationData.findIndex((x) => x.new.length === 0) === -1
    if (this.isNewPost) {
      return emtyValidator()
    }
    return (
      emtyValidator() ||
      validationData.filter((x) => x.new === x.prev).length !==
        validationData.length
    )
  }

  async onSave() {
    if (!this.validateSaveButton()) {
      return
    }
    let post: Partial<IPost> = {}
    const now = Date.now()

    if (this.isNewPost) {
      post.author = this.currentUser.id
      post.content = this.inputContent
      post.createdAt = now
      post.createdBy = 'angular'
      post.title = this.inputTitle
      post.description = this.inputDescroption
      post.id = null
      post.lastEditAt = now

      post = await this.postService.createNewPost(post as IPost)
      await this.userService.updateCurrentUser({
        lastActivity: now,
      })
      this.zone.run(() => {
        this.router.navigate(['/posts', post.id])
      })
      return
    } else {
      post.content = this.inputContent
      post.title = this.inputTitle
      post.description = this.inputDescroption
      post.lastEditAt = now
      post.id = this.post.id
      post.author = this.post.author
      post = await this.postService.editPost(post)
      await this.userService.updateCurrentUser({
        lastActivity: now,
      })
      this.zone.run(() => {
        this.editable = false
      })
    }
  }
  getDate() {
    return new Date(+this.post.createdAt).toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
    })
  }
}
