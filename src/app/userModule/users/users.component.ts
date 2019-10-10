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
import { IUser, UserService, AuthService } from '../../core'
import { Subscription, combineLatest } from 'rxjs'

@Component({
  selector: 'app-page-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.scss'],
})
export class UsersComponent implements OnInit {
  currentUser: IUser
  users: IUser[] = []

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private chRef: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe((x) => {
      this.zone.run(() => {
        this.currentUser = x
      })
    })
    this.userService.users.subscribe((x) => {
      this.zone.run(() => {
        this.users = x
      })
    })

    const obs = new IntersectionObserver(
      (targets) => {
        const target = targets[0]
        if (!target.isIntersecting) {
          return
        }
        this.userService.getUsers({
          take: 10,
          lastUserId:
            this.users.length === 0
              ? null
              : this.users[this.users.length - 1].id,
        })
      },
      {
        rootMargin: '150px',
      }
    )
    obs.observe(document.getElementById('UsersIntersectionObserver'))
  }
  get getUsers() {
    return this.currentUser
      ? this.users.filter((x) => x.id !== this.currentUser.id)
      : this.users
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
}
