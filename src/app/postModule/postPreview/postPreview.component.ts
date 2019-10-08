import {
  Component,
  NgZone,
  ChangeDetectorRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  IUser,
  UserService,
  AuthService,
  UserUpdateData,
  IPost,
} from '../../core'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'app-post-preview',
  templateUrl: 'postPreview.component.html',
  styleUrls: ['postPreview.scss'],
})
export class PostPreviewComponent {
  @Input() post: IPost
  @Input() author: IUser
  constructor() {}
}
