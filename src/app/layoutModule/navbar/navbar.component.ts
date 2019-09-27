import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { UserService, AuthService, FirebaseUserModel } from '../../core'

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: [],
})
export class NavbarComponent implements OnInit {
  currentUser: FirebaseUserModel

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.authService.afAuth.user.subscribe((user) => {
      console.log(user)
      if (user) {
        const userModel = new FirebaseUserModel()
        const { displayName, photoURL, uid } = user
        userModel.name = displayName
        userModel.id = uid
        userModel.image = photoURL
        this.currentUser = userModel
        return
      }
      this.currentUser = null
    })
  }

  async logIn() {
    await this.authService.doGoogleLogin()
  }

  async logOut() {
    await this.authService.doLogout()
  }
}
