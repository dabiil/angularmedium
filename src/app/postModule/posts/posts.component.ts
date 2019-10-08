import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Location, CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { IUser, UserService, AuthService } from '../../core'
import { Subscription, combineLatest } from 'rxjs'

@Component({
  selector: 'app-page-posts',
  templateUrl: 'posts.component.html',
  styleUrls: ['posts.scss'],
})
export class PostsComponent implements OnInit {
  currentUser: IUser
  users: IUser[] = []

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private chRef: ChangeDetectorRef
  ) {
    console.log('psots')
  }

  ngOnInit() {
    combineLatest([
      this.userService.currentUser,
      this.userService.users,
    ]).subscribe(([user, users]) => {
      this.currentUser = user
      this.users = users
      this.chRef.detectChanges()
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
}
