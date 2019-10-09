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
    private postService: PostService
  ) {
    combineLatest([
      this.userService.currentUser,
      this.route.params,
      this.postService.selectedPost,
      this.route.data,
    ]).subscribe(async ([user, { postId }, post, { isNewPost }]) => {
      if (this.post && post.id !== this.post.id) {
        this.selectedAuthor = await this.userService.getUserById(post.author)
      }
      if (post && this.post && post.id !== this.post.id) {
        this.inputContent = post.content
      }
      this.currentUser = user
      this.post = post

      if (this.postId !== postId && !isNewPost) {
        this.postId = postId
        await this.postService.updateSelectedPost(postId)
      }
      if (this.isNewPost !== isNewPost) {
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
      }
      this.chRef.detectChanges()
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
    }
  }

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
    if (this.isNewPost) {
      return validationData.findIndex((x) => x.new.length === 0) === -1
    }
    return (
      validationData.findIndex((x) => x.new.length === 0) === -1 ||
      validationData.findIndex((x) => x.new === x.prev) !== -1
    )
  }

  async onSave() {
    if (!this.validateSaveButton()) {
      return
    }
    const { inputContent, inputDescroption, inputTitle } = this

    if (this.isNewPost) {
      const newPost: IPost = {
        author: this.currentUser.id,
        content: this.inputContent,
        createdAt: Date.now().toString(),
        createdBy: 'angular',
        title: this.inputTitle,
        description: this.inputDescroption,
        id: null,
      }
      const createdPost = await this.postService.createNewPost(newPost)
      console.log(createdPost)
    }
  }
}
