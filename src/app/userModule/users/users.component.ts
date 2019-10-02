import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Location, CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FSUser, UserService, AuthService, FBUser } from '../../core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-page-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.scss'],
})
export class UsersComponent implements OnInit {
  currentUser: FBUser
  users: FSUser[] = []

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {
    console.log('hear')
  }

  async ngOnInit() {
    console.log('init')
    this.userService.currentUser.subscribe((x) => {
      this.currentUser = x
    })
    this.route.data.subscribe(({ users }) => {
      this.users = users
      console.log(users)
    })
  }

  getFilteredUser() {
    return this.currentUser
      ? this.users.filter((x) => x.id !== this.currentUser.id)
      : this.users
  }
}
