import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Location, CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FSUser, UserService, AuthService, FirebaseUserModel } from '../../core'

@Component({
  selector: 'app-page-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.scss'],
})
export class UsersComponent implements OnInit {
  currentUser: FirebaseUserModel
  users: FSUser[] = []
  // profileForm: FormGroup

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute // private location: Location, // private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.route.data.subscribe((routeData) => {
      console.log(routeData)
      const { users, user } = routeData
      this.currentUser = user
      this.users = (users as FSUser[]).filter((x) => x.id !== user.id)
    })
  }
}
