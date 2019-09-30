import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { UserService, AuthService, FBUser } from '../../core'

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: FBUser
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.userService.currentUserObserver.subscribe((user) => {
      this.currentUser = user
    })
  }

  async logIn() {
    try {
      await this.authService.doGoogleLogin()
      this.router.navigate(['/'])
    } catch (error) {
      console.log(error)
    }
  }

  async logOut() {
    try {
      await this.authService.doLogout()
      this.router.navigate(['/'])
    } catch (error) {
      console.log(error)
    }
  }
}
