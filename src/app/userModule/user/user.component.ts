import { Component, OnInit, ɵConsole } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location, CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FSUser, UserService, AuthService, FBUser } from '../../core'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'app-page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['users.scss'],
})
export class UserComponent {
  currentUser: FBUser
  userId = ''
  selectedUser: FSUser = null

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute, // private location: Location, // private fb: FormBuilder
    private router: Router
  ) {
    console.log(route.snapshot)
    combineLatest([this.userService.currentUser, this.route.params]).subscribe(
      ([user, { userId }]) => {
        this.currentUser = user

        if (user && user.id === userId) {
          this.router.navigate(['/users/me'])
        }

        this.userId = userId
      }
    )
    route.data.subscribe((data) => {
      this.selectedUser = data.user
    })
  }
}
