import {
  Component,
  NgZone,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IUser, UserService, AuthService, IPost } from '../../core'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'app-post-preview',
  templateUrl: 'postPreview.component.html',
  styleUrls: ['postPreview.scss'],
})
export class PostPreviewComponent {
  @Input() post: IPost
  constructor() {}

  getDate() {
    return new Date(+this.post.createdAt).toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
    })
  }
  get authorSrc() {
    return (this.post.author as IUser).image
  }
}
