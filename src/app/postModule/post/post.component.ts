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
    ]).subscribe(async ([user, { postId }, post]) => {
      if (this.post && post.id !== this.post.id) {
        this.selectedAuthor = await this.userService.getUserById(post.author)
      }
      if (post && this.post && post.id !== this.post.id) {
        this.inputContent = post.content
      }
      this.currentUser = user
      this.post = post

      if (this.postId !== postId) {
        this.postId = postId
        await this.postService.updateSelectedPost(postId)
      }

      this.chRef.detectChanges()
    })
  }
  onEdit(value: boolean) {
    this.editable = value
  }
  onInput(e: any) {
    this.inputContent = e.target.value
  }
  onTogglePreview() {
    this.preview = !this.preview
  }
  onSave() {}
}
