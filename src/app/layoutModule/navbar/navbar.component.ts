import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { UserService, AuthService, FSUser } from '../../core'

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.scss'],
})
export class NavbarComponent implements OnInit {
  currentUser: FSUser
  constructor(
    public userService: UserService,
    public authService: AuthService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user
      this.chRef.detectChanges()
    })
  }

  async logIn() {
    try {
      await this.authService.doGoogleLogin()
    } catch (error) {
      console.log(error)
    }
  }

  async logOut() {
    try {
      await this.authService.doLogout()
    } catch (error) {
      console.log(error)
    }
  }
}
