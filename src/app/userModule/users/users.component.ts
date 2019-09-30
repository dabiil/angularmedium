import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Location, CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FSUser, UserService, AuthService, FBUser } from '../../core'

@Component({
  selector: 'app-page-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.scss'],
})
export class UsersComponent implements OnInit {
  currentUser: FBUser
  users: FSUser[] = []
  // profileForm: FormGroup

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute // private location: Location, // private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.userService.currentUserObserver.subscribe((x) => {
      this.currentUser = x
    })
    this.route.data.subscribe(({ users }) => {
      this.users = users
    })
  }
  getFilteredUser() {
    return this.currentUser
      ? this.users.filter((x) => x.id !== this.currentUser.id)
      : this.users
  }
}
