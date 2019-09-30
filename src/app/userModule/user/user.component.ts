import { Component, OnInit, ɵConsole } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location, CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FSUser, UserService, AuthService, FBUser } from '../../core'

@Component({
  selector: 'app-page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['users.scss'],
})
export class UserComponent {
  currentUser: FBUser
  userId = ''
  // profileForm: FormGroup

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute, // private location: Location, // private fb: FormBuilder
    private router: Router
  ) {
    this.userService.currentUserObserver.subscribe((user) => {
      this.currentUser = user

      if (user && user.id === this.userId) {
        this.router.navigate(['/users/me'])
      }
    })
    this.route.params.subscribe((param) => {
      this.userId = param.userId

      if (this.currentUser && this.currentUser.id === param.userId) {
        this.router.navigate(['/users/me'])
      }
    })
  }
}
