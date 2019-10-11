import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Location, CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { IUser, UserService, AuthService, IPost, PostService } from '../../core'
import { Subscription, combineLatest } from 'rxjs'

@Component({
  selector: 'app-page-posts',
  templateUrl: 'posts.component.html',
  styleUrls: ['posts.scss'],
})
export class PostsComponent implements OnInit {
  currentUser: IUser
  posts: IPost[] = []

  constructor(
    public userService: UserService,
    public postService: PostService,
    public authService: AuthService,
    private chRef: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    this.userService.currentUser.subscribe((x) => {
      this.zone.run(() => {
        this.currentUser = x
      })
    })
    this.postService.posts.subscribe((x) => {
      this.zone.run(() => {
        this.posts = x
      })
    })
    await this.postService.getAllPostsWithAuthor()
  }

  getActivity(user: IUser) {
    if (!user.lastActivity) {
      return null
    }
    return new Date(user.lastActivity).toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
    })
  }
  getPosts() {
    return this.posts
  }
  getDate(post: IPost) {
    return new Date(+post.createdAt).toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
    })
  }
  getAuthorSrc(post: IPost) {
    return (post.author as IUser).image
  }
}
