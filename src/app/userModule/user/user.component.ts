import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FSUser, UserService, AuthService } from '../../core'
import { combineLatest } from 'rxjs'

@Component({
  selector: 'app-page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['users.scss'],
})
export class UserComponent {
  currentUser: FSUser
  userId = ''
  selectedUser: FSUser = null
  isCurrentUser = false
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute, // private location: Location, // private fb: FormBuilder
    private router: Router
  ) {
    combineLatest([
      this.userService.currentUser,
      this.route.params,
      this.route.data,
    ]).subscribe(([user, { userId }, { isCurrentUser }]) => {
      if (!isCurrentUser && user && user.id === userId) {
        this.router.navigate(['/users/me'])
        return
      }

      if (isCurrentUser) {
        this.isCurrentUser = true
      }
      this.currentUser = user
      this.userId = userId
    })
    route.data.subscribe((data) => {
      this.selectedUser = data.user
    })
  }
}
