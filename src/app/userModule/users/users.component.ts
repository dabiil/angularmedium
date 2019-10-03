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
import { FSUser, UserService, AuthService } from '../../core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-page-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.scss'],
})
export class UsersComponent implements OnInit {
  currentUser: FSUser
  users: FSUser[] = []

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe((x) => {
      this.currentUser = x
      this.chRef.detectChanges()
    })
    this.userService.users.subscribe((x) => {
      this.users = x
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
        rootMargin: '100px',
      }
    )
    obs.observe(document.getElementById('UsersIntersectionObserver'))
  }

  get filteredUsers() {
    return this.currentUser
      ? this.users.filter((x) => x.id !== this.currentUser.id)
      : this.users
  }
}
