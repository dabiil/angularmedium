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
export class PostPreviewComponent implements OnInit {
  @Input() post: IPost
  @Input() author: IUser
  constructor() {}

  ngOnInit(): void {
    console.log(this.post, this.author)
    this.getDate()
  }
  getDate() {
    return new Date(+this.post.createdAt).toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
    })
  }
}
